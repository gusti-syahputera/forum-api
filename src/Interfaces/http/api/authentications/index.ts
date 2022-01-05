import { Plugin } from '@hapi/hapi'

import IocContainer from '../../../../Commons/IocContainer'

import routes from './routes'
import AuthenticationsHandler from './handler'
import ResponseRenderer from '../../ResponseRenderer'

export interface Options {
  container: IocContainer
  renderer: ResponseRenderer
}

const authentications: Plugin<Options> = {
  name: 'authentications',
  register: async (server, { container, renderer }) => {
    const authenticationsHandler = new AuthenticationsHandler(container, renderer)
    server.route(routes(authenticationsHandler))
  }
}

export default authentications
