import { DependencyContainer } from 'tsyringe'
import { Plugin } from '@hapi/hapi'

import routes from './routes'
import UsersHandler from './handler'

export interface Options {
  container: DependencyContainer
}

const users: Plugin<Options> = {
  name: 'users',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container)
    server.route(routes(usersHandler))
  }
}

export default users
