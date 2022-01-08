import { ServerRoute } from '@hapi/hapi'

import AuthenticationsHandler from './AuthenticationsHandler'

export default (handler: AuthenticationsHandler): ServerRoute[] => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler
  }
])
