import { Plugin, Server, ServerRegisterPluginObject as PluginObject } from '@hapi/hapi'

import IocContainer from '../../../../Commons/IocContainer'

import routes from './routes'
import UsersHandler from './handler'
import ResponseRenderer from '../../ResponseRenderer'

export interface Options {
  container: IocContainer
  renderer: ResponseRenderer
}

export const users: Plugin<Options> = {
  name: 'users',
  register: async (server, { container, renderer }) => {
    const handler = new UsersHandler(container, renderer)
    server.route(routes(handler))
  }
}

const register = async (server: Server, container: IocContainer, renderer: ResponseRenderer): Promise<void> => {
  const pluginObject: PluginObject<Options> = {
    plugin: users,
    options: { container, renderer }
  }
  await server.register(pluginObject)
}

export default register
