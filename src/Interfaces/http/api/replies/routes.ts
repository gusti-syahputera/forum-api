import { ServerRoute } from '@hapi/hapi'

import RepliesHandler from './RepliesHandler'

export default (handler: RepliesHandler, authStrategy: string): ServerRoute[] => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyHandler,
    options: { auth: authStrategy }
  }, {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReplyHandler,
    options: { auth: authStrategy }
  }
])
