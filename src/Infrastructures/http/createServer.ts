import * as Hapi from '@hapi/hapi'
import { ServerRegisterPluginObject as PluginObject } from '@hapi/hapi'

import ClientError from '../../Commons/exceptions/ClientError'
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator'
import users, { Options as UsersPluginOptions } from '../../Interfaces/http/api/users'
import authentications, { Options as AuthenticationsPluginOptions } from '../../Interfaces/http/api/authentications'
import { DependencyContainer } from 'tsyringe'

export default async function createServer (container): Promise<Hapi.Server> {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  })

  const usersPlugin: PluginObject<UsersPluginOptions> = {
    plugin: users,
    options: { container }
  }

  const authenticationsPlugin: PluginObject<AuthenticationsPluginOptions> = {
    plugin: authentications,
    options: { container }
  }

  await server.register([usersPlugin, authenticationsPlugin])

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
