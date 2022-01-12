import { Plugin, Server, ServerRegisterPluginObject as PluginObject } from '@hapi/hapi'

import IocContainer from '../../../IocContainer'

import routes from './routes'
import CommentLikesHandler from './CommentLikesHandler'
import ResponseRenderer from '../../ResponseRenderer'

export interface Options {
  container: IocContainer
  renderer: ResponseRenderer
  authStrategy: string
}

export const commentLikes: Plugin<Options> = {
  name: 'comment-likes',
  register: async (server, { container, renderer, authStrategy }) => {
    const handler = new CommentLikesHandler(container, renderer)
    server.route(routes(handler, authStrategy))
  }
}

const register = async (
  server: Server,
  container: IocContainer,
  renderer: ResponseRenderer,
  authStrategy: string
): Promise<void> => {
  const pluginObject: PluginObject<Options> = {
    plugin: commentLikes,
    options: { container, renderer, authStrategy }
  }
  await server.register(pluginObject)
}

export default register
