import { AuthorizationError, InvariantError, NotFoundError } from '../../Commons/exceptions'
import ThreadRepository from '../../Domains/threads/ThreadRepository'
import CommentRepository from '../../Domains/comments/CommentRepository'

export interface Payload {
  userId: string
  threadId: string
  commentId: string
}

export default class DeleteCommentUseCase {
  constructor (
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository
  ) {}

  async execute ({ userId, threadId, commentId }: Payload): Promise<void> {
    await this.assertThreadExists(threadId)

    // Get Comment entity
    const commentPromise = this.commentRepository.getCommentById(commentId)
    const comment = await commentPromise.catch((e) => {
      if (e instanceof NotFoundError) {
        e.message = 'DELETE_COMMENT.COMMENT_NOT_FOUND'
      }
      throw e
    })

    // Assert that the comment belongs to the thread
    if (comment.thread_id !== threadId) {
      throw new InvariantError('DELETE_COMMENT.COMMENT_DOES_NOT_BELONG_TO_THREAD')
    }
    // Assert that user is the comment's owner
    if (comment.owner !== userId) {
      throw new AuthorizationError('DELETE_COMMENT.USER_IS_NOT_OWNER')
    }

    // Proceed to delete
    return await this.commentRepository.deleteCommentById(commentId)
  }

  async assertThreadExists (threadId: string): Promise<void> {
    try {
      await this.threadRepository.getThreadById(threadId)
    } catch (e) {
      if (e instanceof NotFoundError) {
        e.message = 'DELETE_COMMENT.THREAD_NOT_FOUND'
      }
      throw e
    }
  }
}
