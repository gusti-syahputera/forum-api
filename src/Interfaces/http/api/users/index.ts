import { Plugin } from '@hapi/hapi'

import IocContainer from '../../../../Commons/IocContainer'

import routes from './routes'
import UsersHandler from './handler'
import ResponseRenderer from '../../ResponseRenderer'

export interface Options {
  container: IocContainer
  renderer: ResponseRenderer
}

const users: Plugin<Options> = {
  name: 'users',
  register: async (server, { container, renderer }) => {
    const usersHandler = new UsersHandler(container, renderer)
    server.route(routes(usersHandler))
  }
}

export default users
