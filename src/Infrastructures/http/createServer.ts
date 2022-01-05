import * as Hapi from '@hapi/hapi'

import ClientError from '../../Commons/exceptions/ClientError'
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator'
import registerUsersPlugin from '../../Interfaces/http/api/users'
import registerAuthenticationsPlugin from '../../Interfaces/http/api/authentications'
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
    registerAuthenticationsPlugin(server, container, renderer)
  ])

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request

    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response)

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        })
        newResponse.code(translatedError.statusCode)
        return newResponse
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!translatedError.isServer) {
        return h.continue
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
        // message: response.message
      })
      newResponse.code(500)
      return newResponse
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  })

  return server
}
