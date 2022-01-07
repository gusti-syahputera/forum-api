import { AuthorizationError } from '../../Commons/exceptions'
import ThreadRepository from '../../Domains/threads/ThreadRepository'
import CommentRepository from '../../Domains/comments/CommentRepository'
import ReplyRepository from '../../Domains/replies/ReplyRepository'

export interface Payload {
  userId: string
  threadId: string
  commentId: string
  replyId: string
}

export default class DeleteReplyUseCase {
  constructor (
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly replyRepository: ReplyRepository
  ) {}

  async execute ({ userId, threadId, commentId, replyId }: Payload): Promise<void> {
    // Assert parent entities do exist
    await Promise.all([
      this.assertThreadExists(threadId),
      this.assertCommentExists(commentId)
    ])

    // Get Reply entity
    const replyPromise = this.replyRepository.getReplyById(replyId)
    const reply = await replyPromise.catch((e) => {
      if (e.message === 'REPLY.NOT_FOUND') {
        e.message = 'DELETE_REPLY.REPLY_NOT_FOUND'
      }
      throw e
    })

    // Assert that user is the reply's owner
    if (reply.owner !== userId) {
      throw new AuthorizationError('DELETE_REPLY.USER_IS_NOT_OWNER')
    }

    // Proceed to delete
    return await this.replyRepository.deleteReplyById(replyId)
  }

  async assertThreadExists (threadId: string): Promise<void> {
    try {
      await this.threadRepository.getThreadById(threadId)
    } catch (e) {
      if (e.message === 'THREAD.NOT_FOUND') {
        e.message = 'DELETE_REPLY.THREAD_NOT_FOUND'
      }
      throw e
    }
  }

  private async assertCommentExists (commentId: string): Promise<void> {
    try {
      await this.commentRepository.getCommentById(commentId)
    } catch (e) {
      if (e.message === 'COMMENT.NOT_FOUND') {
        e.message = 'DELETE_REPLY.COMMENT_NOT_FOUND'
      }
      throw e
    }
  }
}
