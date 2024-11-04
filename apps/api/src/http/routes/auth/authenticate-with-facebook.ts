import { env } from '@saas/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function AuthenticateWithFacebook(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/facebook',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with Facebook',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      // Extrai o código recebido sem realizar substituições
      const { code } = request.body

      const facebookOAuthUrl = new URL(
        'https://graph.facebook.com/v10.0/oauth/access_token',
      )

      const bodyParams = new URLSearchParams({
        client_id: env.FACEBOOK_OAUTH_CLIENT_ID,
        client_secret: env.FACEBOOK_OAUTH_CLIENT_SECRET,
        redirect_uri: env.FACEBOOK_OAUTH_REDIRECT_URI,
        code,
        grant_type: 'authorization_code',
      })

      console.log(bodyParams)

      const facebookAccessTokenResponse = await fetch(
        facebookOAuthUrl.toString(),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: bodyParams.toString(),
        },
      )

      const facebookAccessTokenData = await facebookAccessTokenResponse.json()

      const { access_token: facebookAccessToken } = z
        .object({
          access_token: z.string(),
          expires_in: z.number(),
          token_type: z.literal('bearer'),
        })
        .parse(facebookAccessTokenData)

      console.log(facebookAccessTokenData)

      const facebookUserResponse = await fetch(
        'https://graph.facebook.com/me?fields=id,name,email,picture',
        {
          headers: {
            Authorization: `Bearer ${facebookAccessToken}`,
          },
        },
      )

      const facebookUserData = await facebookUserResponse.json()

      const {
        id: facebookId,
        name,
        email,
        picture,
      } = z
        .object({
          id: z.string(),
          email: z.string().email().nullable(),
          name: z.string().nullable(),
          picture: z
            .object({
              data: z.object({ url: z.string().url() }),
            })
            .nullable(),
        })
        .parse(facebookUserData)

      if (!email) {
        throw new BadRequestError(
          'Your Facebook account must have an email to authenticate.',
        )
      }

      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            avatarUrl: picture?.data.url ?? null,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'FACEBOOK',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'FACEBOOK',
            providerAccountId: facebookId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}
