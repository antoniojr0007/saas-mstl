import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { AuthenticateWithFacebook } from './routes/auth/authenticate-with-facebook'
import { AuthenticateWithGithub } from './routes/auth/authenticate-with-github'
import { AuthenticateWithGoogle } from './routes/auth/authenticate-with-google'
import { AuthenticateWithPassword } from './routes/auth/authenticate-with-password'
import { CreateAccount } from './routes/auth/create-account'
import { GetProfile } from './routes/auth/get-profile'
import { RequestPasswordRecovery } from './routes/auth/request-password-recovery'
import { PasswordReset } from './routes/auth/reset-password'
import { GetOrganizationBilling } from './routes/billing/get-organization-billing'
import { AcceptInvite } from './routes/invite/accept-invite'
import { CreateInvite } from './routes/invite/create-invite'
import { GetInvite } from './routes/invite/get-invite'
import { GetInvites } from './routes/invite/get-invites'
import { GetPendingInvites } from './routes/invite/get-pending-invites'
import { RejectInvite } from './routes/invite/reject-invite'
import { RevokeInvite } from './routes/invite/revoke-invite'
import { GetMembers } from './routes/member/get-members'
import { RemoveMembers } from './routes/member/remove-member'
import { UpdateMembers } from './routes/member/update-member'
import { CreateOrganization } from './routes/orgs/create-organization'
import { GetMemberShip } from './routes/orgs/get-membership'
import { GetOrganization } from './routes/orgs/get-organization'
import { GetOrganizations } from './routes/orgs/get-organizations'
import { ShutDownOrganization } from './routes/orgs/shutdown-organization'
import { TransferOwnerOrganization } from './routes/orgs/transfer-owner-organization'
import { UpdateOrganization } from './routes/orgs/update-organization'
import { CreateProject } from './routes/projects/create-project'
import { DeleteProject } from './routes/projects/delete-project'
import { GetProject } from './routes/projects/get-project'
import { GetProjects } from './routes/projects/get-projects'
import { UpdateProject } from './routes/projects/update-project'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js Saas RBAC',
      description: 'Full-stack SaaS app with multi-tenant & RBAC',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(fastifyCors)

// Users routes
app.register(CreateAccount)
app.register(AuthenticateWithPassword)
app.register(GetProfile)
app.register(RequestPasswordRecovery)
app.register(PasswordReset)
app.register(AuthenticateWithGithub)
app.register(AuthenticateWithGoogle)
app.register(AuthenticateWithFacebook)

// Organization Routes
app.register(CreateOrganization)
app.register(GetMemberShip)
app.register(GetOrganization)
app.register(GetOrganizations)
app.register(UpdateOrganization)
app.register(ShutDownOrganization)
app.register(TransferOwnerOrganization)

// Project Routes
app.register(CreateProject)
app.register(DeleteProject)
app.register(GetProject)
app.register(GetProjects)
app.register(UpdateProject)

// Member Routes
app.register(GetMembers)
app.register(UpdateMembers)
app.register(RemoveMembers)

// Ivite Members Routes
app.register(CreateInvite)
app.register(GetInvite)
app.register(GetInvites)
app.register(AcceptInvite)
app.register(RevokeInvite)
app.register(RejectInvite)
app.register(GetPendingInvites)

// Billing Organization Routes
app.register(GetOrganizationBilling)

app.listen({ 
  port: env.PORT,
  host: 'RENDER' in env ? '0.0.0.0' : 'localhost',}
).then(() => {
  console.log('HTTP server running!')
})
