import { Request, ResponseToolkit, Server } from '@hapi/hapi'

import ResponseRenderer from './ResponseRenderer'
import { ClientError, DomainErrorTranslator } from '../../Commons/exceptions'

export default (server: Server, renderer: ResponseRenderer): void => {
  server.ext('onPreResponse', makeHandler(renderer))
}

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
