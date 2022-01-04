import { Plugin } from '@hapi/hapi'

import IocContainer from '../../../../Commons/IocContainer'

import routes from './routes'
import UsersHandler from './handler'

export interface Options {
  container: IocContainer
}

const users: Plugin<Options> = {
  name: 'users',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container)
    server.route(routes(usersHandler))
  }
}

export default users
