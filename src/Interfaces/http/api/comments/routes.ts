import { ServerRoute } from '@hapi/hapi'

import CommentsHandler from './CommentsHandler'

export default (handler: CommentsHandler, authStrategy: string): ServerRoute[] => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: { auth: authStrategy }
  }, {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: { auth: authStrategy }
  }
])
