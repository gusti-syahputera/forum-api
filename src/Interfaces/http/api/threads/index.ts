import { Plugin, Server, ServerRegisterPluginObject as PluginObject } from '@hapi/hapi'

import IocContainer from '../../../IocContainer'

import routes from './routes'
import ThreadsHandler from './ThreadsHandler'
import ResponseRenderer from '../../ResponseRenderer'

export interface Options {
  container: IocContainer
  renderer: ResponseRenderer
  authStrategy: string
}

export const threads: Plugin<Options> = {
  name: 'threads',
  register: async (server, { container, renderer, authStrategy }) => {
    const handler = new ThreadsHandler(container, renderer)
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
    plugin: threads,
    options: { container, renderer, authStrategy }
  }
  await server.register(pluginObject)
}

export default register
