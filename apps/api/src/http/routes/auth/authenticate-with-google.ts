import { env } from '@saas/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function AuthenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/google',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with Google',
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
      // Função para substituir '%2F' por '/'
      const replaceEncodedSlash = (input: string) => input.replace(/%2F/g, '/')

      // Extrai e ajusta o código recebido
      let { code } = request.body
      code = replaceEncodedSlash(code) // Atualiza o code com os '/' decodificados

      const googleOAuthUrl = new URL('https://oauth2.googleapis.com/token')

      const bodyParams = new URLSearchParams({
        client_id: env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI,
        code,
        grant_type: 'authorization_code',
      })

      console.log(bodyParams)

      const googleAccessTokenResponse = await fetch(googleOAuthUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      })

      const googleAccessTokenData = await googleAccessTokenResponse.json()

      const { access_token: googleAccessToken } = z
        .object({
          access_token: z.string(),
          expires_in: z.number(),
          token_type: z.string(),
          scope: z.string(),
          refresh_token: z.string().optional(),
        })
        .parse(googleAccessTokenData)

      console.log(googleAccessTokenData)

      const googleUserResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        },
      )

      const googleUserData = await googleUserResponse.json()

      const {
        id: googleId,
        name,
        email,
        picture: avatarUrl,
      } = z
        .object({
          id: z.string(),
          email: z.string().email(),
          name: z.string().nullable(),
          picture: z.string().url().nullable(),
        })
        .parse(googleUserData)

      if (!email) {
        throw new BadRequestError(
          'Your Google account must have an email to authenticate.',
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
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GOOGLE',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GOOGLE',
            providerAccountId: googleId,
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
