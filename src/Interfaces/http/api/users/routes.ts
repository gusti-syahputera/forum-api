import { ServerRoute } from '@hapi/hapi'

import UsersHandler from './UsersHandler'

export default (handler: UsersHandler): ServerRoute[] => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler
  }
])
