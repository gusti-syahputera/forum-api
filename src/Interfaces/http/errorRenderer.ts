import {
  Plugin,
  Request,
  ResponseToolkit,
  Server,
  ServerRegisterPluginObject as PluginObject
} from '@hapi/hapi'

import ResponseRenderer from './ResponseRenderer'
import { ClientError, DomainErrorTranslator } from '../../Commons/exceptions'

export interface Options {
  renderer: ResponseRenderer
}

export const errorRenderer: Plugin<Options> = {
  name: 'error-renderer',
  register: async (server, { renderer }) => {
    server.ext('onPreResponse', makeHandler(renderer))
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

const makeHandler = (renderer: ResponseRenderer) => (request: Request, h: ResponseToolkit) => {
  // mendapatkan konteks response dari request
  const { response } = request

  if (response instanceof Error) {
    // bila response tersebut error, tangani sesuai kebutuhan
    const translatedError = DomainErrorTranslator.translate(response)

    // penanganan client error secara internal.
    if (translatedError instanceof ClientError) {
      return renderer.fail(h, translatedError.message, translatedError.statusCode)
    }

    // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
    if (!translatedError.isServer) {
      return h.continue
    }

    // penanganan server error sesuai kebutuhan
    return renderer.internalError(h)
  }

  // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
  return h.continue
}
