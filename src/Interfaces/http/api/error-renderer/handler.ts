import DomainErrorTranslator from '../../../../Commons/exceptions/DomainErrorTranslator'
import ClientError from '../../../../Commons/exceptions/ClientError'
import { Request, ResponseToolkit } from '@hapi/hapi'
import ResponseRenderer from '../../ResponseRenderer'

export default class ErrorRenderer {
  constructor (private readonly renderer: ResponseRenderer) {}

  onPreResponseHandler = (request: Request, h: ResponseToolkit) => {
    // mendapatkan konteks response dari request
    const { response } = request

    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response)

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        return this.renderer.fail(h, translatedError.message, translatedError.statusCode)
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!translatedError.isServer) {
        return h.continue
      }

      // penanganan server error sesuai kebutuhan
      return this.renderer.internalError(h)
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  }
}
