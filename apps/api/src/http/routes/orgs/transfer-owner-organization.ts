import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { GetUserPermissions } from '@/utils/get-user-permissions'

export async function TransferOwnerOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Transfer organization ownership ',
          security: [{ bearerAuth: [] }],
          body: z.object({
            TransferToUserId: z.string().uuid(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            // 204: z.null({}),
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
        if (cannot('transfer_ownerShip', authOrganization)) {
          throw new UnauthorizedError(
            `You're not allowed transfer this organization ownership`,
          )
        }

        const { TransferToUserId } = request.body

        const transferToMemberShip = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: TransferToUserId,
            },
          },
        })

        if (!transferToMemberShip) {
          throw new BadRequestError(
            `target user is not member of this organization`,
          )
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              organizationId_userId: {
                organizationId: organization.id,
                userId: TransferToUserId,
              },
            },
            data: {
              role: 'ADMIN',
            },
          }),

          prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              ownerId: TransferToUserId,
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
