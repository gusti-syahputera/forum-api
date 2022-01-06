import * as Hapi from '@hapi/hapi'

import IocContainer from '../../Commons/IocContainer'
import ResponseRenderer from '../../Interfaces/http/ResponseRenderer'

/* Plugins */
import registerJwtAuthStrategy from '../../Interfaces/http/jwtAuthStrategy'
import registerUsersPlugin from '../../Interfaces/http/api/users'
import registerAuthenticationsPlugin from '../../Interfaces/http/api/authentications'
import registerThreadsPlugin from '../../Interfaces/http/api/threads'
import registerErrorRendererPlugin from '../../Interfaces/http/errorRenderer'

export default async function createServer (
  container: IocContainer,
  renderer = new ResponseRenderer('terjadi kegagalan pada server kami')
): Promise<Hapi.Server> {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  })

  const authStrategyName = await registerJwtAuthStrategy(server, 'JWT')
  await Promise.all([
    registerUsersPlugin(server, container, renderer),
    registerAuthenticationsPlugin(server, container, renderer),
    registerThreadsPlugin(server, container, renderer, authStrategyName),
    registerErrorRendererPlugin(server, renderer)
  ])

  return server
}
