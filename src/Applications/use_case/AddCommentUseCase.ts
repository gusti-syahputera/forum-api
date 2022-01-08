import ThreadRepository from '../../Domains/threads/ThreadRepository'
import CommentRepository from '../../Domains/comments/CommentRepository'
import { AddedComment, NewComment } from '../../Domains/comments/entities'

export interface Payload {
  thread_id: string
  owner: string
  content: string
}

export default class AddCommentUseCase {
  constructor (
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository
  ) {}

  async execute (useCasePayload: Payload): Promise<AddedComment> {
    await this.assertThreadExists(useCasePayload.thread_id)
    const newComment = new NewComment(useCasePayload)
    return await this.commentRepository.addComment(newComment)
  }

  private async assertThreadExists (threadId: string): Promise<void> {
    try {
      await this.threadRepository.getThreadById(threadId)
    } catch (e) {
      if (e.message === 'THREAD.NOT_FOUND') {
        e.message = 'NEW_COMMENT.THREAD_NOT_FOUND'
      }
      throw e
    }
  }
}
