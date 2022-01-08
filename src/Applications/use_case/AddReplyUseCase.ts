import ThreadRepository from '../../Domains/threads/ThreadRepository'
import CommentRepository from '../../Domains/comments/CommentRepository'
import ReplyRepository from '../../Domains/replies/ReplyRepository'
import { AddedReply, NewReply } from '../../Domains/replies/entities'

export interface Payload {
  thread_id: string
  comment_id: string
  owner: string
  content: string
}

export default class AddReplyUseCase {
  constructor (
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly replyRepository: ReplyRepository
  ) {}

  async execute (useCasePayload: Payload): Promise<AddedReply> {
    // Assert parent entities do exist
    await Promise.all([
      this.assertThreadExists(useCasePayload.thread_id),
      this.assertCommentExists(useCasePayload.comment_id)
    ])

    const newReply = new NewReply(useCasePayload)
    return await this.replyRepository.addReply(newReply)
  }

  private async assertThreadExists (threadId: string): Promise<void> {
    try {
      await this.threadRepository.getThreadById(threadId)
    } catch (e) {
      if (e.message === 'THREAD.NOT_FOUND') {
        e.message = 'NEW_REPLY.THREAD_NOT_FOUND'
      }
      throw e
    }
  }

  private async assertCommentExists (commentId: string): Promise<void> {
    try {
      await this.commentRepository.getCommentById(commentId)
    } catch (e) {
      if (e.message === 'COMMENT.NOT_FOUND') {
        e.message = 'NEW_REPLY.COMMENT_NOT_FOUND'
      }
      throw e
    }
  }
}
