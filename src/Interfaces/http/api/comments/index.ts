import { Plugin, Server, ServerRegisterPluginObject as PluginObject } from '@hapi/hapi'

import IocContainer from '../../../../Commons/IocContainer'

import routes from './routes'
import CommentsHandler from './CommentsHandler'
import ResponseRenderer from '../../ResponseRenderer'

export interface Options {
  container: IocContainer
  renderer: ResponseRenderer
  authStrategy: string
}

export const comments: Plugin<Options> = {
  name: 'comments',
  register: async (server, { container, renderer, authStrategy }) => {
    const handler = new CommentsHandler(container, renderer)
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
    plugin: comments,
    options: { container, renderer, authStrategy }
  }
  await server.register(pluginObject)
}

export default register
