import * as Jwt from '@hapi/jwt'
import { Server, ServerAuthSchemeOptions } from '@hapi/hapi'

export default async (server: Server, authStrategyName: string): Promise<string> => {
  await server.register({ plugin: Jwt })

  const options: ServerAuthSchemeOptions = {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCCESS_TOKEN_AGE ?? 15
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { userId: artifacts.decoded.payload.sub }
    })
  }
  server.auth.strategy(authStrategyName, 'jwt', options)

  return authStrategyName
}
