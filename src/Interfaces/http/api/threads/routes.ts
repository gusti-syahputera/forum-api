import { ServerRoute } from '@hapi/hapi'

import ThreadsHandler from './ThreadsHandler'

export default (handler: ThreadsHandler, authStrategy: string): ServerRoute[] => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: { auth: authStrategy }
  }
])
