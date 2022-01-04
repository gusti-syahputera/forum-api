import { DependencyContainer } from 'tsyringe'
import { Plugin } from '@hapi/hapi'

import routes from './routes'
import AuthenticationsHandler from './handler'

export interface Options {
  container: DependencyContainer
}

const authentications: Plugin<Options> = {
  name: 'authentications',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container)
    server.route(routes(authenticationsHandler))
  }
}

export default authentications
