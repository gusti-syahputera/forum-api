import { ServerRoute } from '@hapi/hapi'

import CommentLikesHandler from './CommentLikesHandler'

export default (handler: CommentLikesHandler, authStrategy: string): ServerRoute[] => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putCommentLikeHandler,
    options: { auth: authStrategy }
  }
])
