import * as Hapi from '@hapi/hapi'

import registerUsersPlugin from '../../Interfaces/http/api/users'
import registerAuthenticationsPlugin from '../../Interfaces/http/api/authentications'
import registerErrorRendererPlugin from '../../Interfaces/http/api/error-renderer'
import IocContainer from '../../Commons/IocContainer'
import ResponseRenderer from '../../Interfaces/http/ResponseRenderer'

export default async function createServer (
  container: IocContainer,
  renderer = new ResponseRenderer('terjadi kegagalan pada server kami')
): Promise<Hapi.Server> {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  })

  await Promise.all([
    registerUsersPlugin(server, container, renderer),
    registerAuthenticationsPlugin(server, container, renderer),
    registerErrorRendererPlugin(server, renderer)
  ])

  return server
}
