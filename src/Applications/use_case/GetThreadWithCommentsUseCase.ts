import ThreadRepository from '../../Domains/threads/ThreadRepository'
import CommentRepository from '../../Domains/comments/CommentRepository'
import { Thread } from '../../Domains/threads/entities'
import { ThreadComment } from '../../Domains/comments/entities'

export interface Payload {
  threadId: string
}

export default class GetThreadWithCommentsUseCase {
  constructor (
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly deletedCommentContentMask: string = '**deleted**'
  ) {}

  async execute ({ threadId }: Payload): Promise<Thread<ThreadComment>> {
    const thread = await this.threadRepository.getThreadById(threadId) as Thread<ThreadComment>
    thread.comments = await this.commentRepository.getCommentsByThreadId(threadId)
    this.transformComments(thread.comments)
    return thread
  }

  protected transformComments (comments: ThreadComment[]): void {
    // Mask deleted comment's content
    comments.forEach(comment => {
      if (comment.deleted_at !== null) {
        comment.content = this.deletedCommentContentMask
      }
      // Strip unneeded fields
      comment.deleted_at = undefined
    })
  }
}
