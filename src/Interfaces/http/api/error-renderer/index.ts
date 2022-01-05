import { Plugin, Server, ServerRegisterPluginObject as PluginObject } from '@hapi/hapi'

import ErrorRenderer from './handler'
import ResponseRenderer from '../../ResponseRenderer'

export interface Options {
  renderer: ResponseRenderer
}

export const errorRenderer: Plugin<Options> = {
  name: 'error-renderer',
  register: async (server, { renderer }) => {
    const handler = new ErrorRenderer(renderer)
    server.ext('onPreResponse', handler.onPreResponseHandler)
  }
}

const register = async (server: Server, renderer: ResponseRenderer): Promise<void> => {
  const pluginObject: PluginObject<Options> = {
    plugin: errorRenderer,
    options: { renderer }
  }
  await server.register(pluginObject)
}

export default register
