import * as Hapi from '@hapi/hapi'

import IocContainer from '../../Interfaces/IocContainer'
import ResponseRenderer from '../../Interfaces/http/ResponseRenderer'

/* Plugins */
import registerJwtAuthStrategy from '../../Interfaces/http/jwtAuthStrategy'
import registerUsersPlugin from '../../Interfaces/http/api/users'
import registerAuthenticationsPlugin from '../../Interfaces/http/api/authentications'
import registerThreadsPlugin from '../../Interfaces/http/api/threads'
import registerCommentsPlugin from '../../Interfaces/http/api/comments'
import registerReplyPlugin from '../../Interfaces/http/api/replies'
import registerCommentLikePlugin from '../../Interfaces/http/api/comment-likes'
import registerErrorRenderer from '../../Interfaces/http/errorRenderer'

export default async function createServer (
  container: IocContainer,
  renderer = new ResponseRenderer('terjadi kegagalan pada server kami')
): Promise<Hapi.Server> {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  })

  registerErrorRenderer(server, renderer)

  // Register auth strategy
  const authStrategyName = await registerJwtAuthStrategy(server, 'JWT')

  // Register API plugins
  await Promise.all([
    registerUsersPlugin(server, container, renderer),
    registerAuthenticationsPlugin(server, container, renderer),
    registerThreadsPlugin(server, container, renderer, authStrategyName),
    registerCommentsPlugin(server, container, renderer, authStrategyName),
    registerReplyPlugin(server, container, renderer, authStrategyName),
    registerCommentLikePlugin(server, container, renderer, authStrategyName)
  ])

  return server
}
