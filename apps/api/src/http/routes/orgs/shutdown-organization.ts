import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { GetUserPermissions } from '@/utils/get-user-permissions'

export async function ShutDownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'ShutDown organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null({}),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { memberShip, organization } =
          await request.getUserMemberShip(slug)

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = GetUserPermissions(userId, memberShip.role)
        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            `You're not allowed shutdown this organization`,
          )
        }

        await prisma.organization.delete({
          where: { id: organization.id },
        })
        return reply.status(204).send()
      },
    )
}
