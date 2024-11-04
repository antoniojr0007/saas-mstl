import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function RequestPasswordRecovery(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/password/recovery',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Recovery with a password',
          body: z.object({
            email: z.string().email(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { email } = request.body

        const userFormEmail = await prisma.user.findUnique({
          where: { email },
        })

        if (!userFormEmail) {
          return reply.status(201).send()
        }
        const { id: code } = await prisma.token.create({
          data: {
            type: 'PASSWORD_RECOVER',
            userId: userFormEmail.id,
          },
        })

        console.log('Recover password token', code)
        return reply.status(201).send()
      },
    )
}
