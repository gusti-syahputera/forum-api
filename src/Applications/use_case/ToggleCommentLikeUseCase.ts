import { CommentLike } from '../../Domains/comment-likes/entities'
import ThreadRepository from '../../Domains/threads/ThreadRepository'
import CommentRepository from '../../Domains/comments/CommentRepository'
import CommentLikeRepository from '../../Domains/comment-likes/CommentLikeRepository'

export interface Payload {
  thread_id: string
  comment_id: string
  user_id: string
}

export default class ToggleCommentLikeUseCase {
  constructor (
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly commentLikeRepository: CommentLikeRepository
  ) {}

  async execute (useCasePayload: Payload): Promise<void> {
    // Assert parent entities do exist
    await Promise.all([
      this.assertThreadExists(useCasePayload.thread_id),
      this.assertCommentExists(useCasePayload.comment_id)
    ])

    // Try to add Like; if it's already exists though, remove it instead
    const like = new CommentLike(useCasePayload)
    try {
      await this.commentLikeRepository.addLike(like)
    } catch (e) {
      if (e.message === 'ADD_LIKE.ALREADY_EXISTS') {
        await this.commentLikeRepository.deleteLike(like)
      } else throw e
    }
  }

  private async assertThreadExists (threadId: string): Promise<void> {
    try {
      await this.threadRepository.getThreadById(threadId)
    } catch (e) {
      if (e.message === 'THREAD.NOT_FOUND') {
        e.message = 'TOGGLE_LIKE.THREAD_NOT_FOUND'
      }
      throw e
    }
  }

  private async assertCommentExists (commentId: string): Promise<void> {
    try {
      await this.commentRepository.getCommentById(commentId)
    } catch (e) {
      if (e.message === 'COMMENT.NOT_FOUND') {
        e.message = 'TOGGLE_LIKE.COMMENT_NOT_FOUND'
      }
      throw e
    }
  }
}
