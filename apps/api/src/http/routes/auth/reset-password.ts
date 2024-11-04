import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'

export async function PasswordReset(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/password/reset',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Recovery with a password',
          body: z.object({
            code: z.string(),
            password: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { code, password } = request.body

        const tokenFormCode = await prisma.token.findUnique({
          where: { id: code },
        })

        if (!tokenFormCode) {
          throw new UnauthorizedError()
        }

        const passwordHash = await hash(password, 6)

        await prisma.$transaction([
          prisma.user.update({
            where: { id: tokenFormCode.userId },
            data: {
              passwordHash,
            },
          }),

          prisma.token.delete({
            where: {
              id: code,
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
