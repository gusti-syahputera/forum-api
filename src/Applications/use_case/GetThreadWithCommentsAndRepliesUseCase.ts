import ThreadRepository from '../../Domains/threads/ThreadRepository'
import CommentRepository from '../../Domains/comments/CommentRepository'
import ReplyRepository from '../../Domains/replies/ReplyRepository'
import { Thread } from '../../Domains/threads/entities'
import { CommentReply } from '../../Domains/replies/entities'
import { ThreadComment } from '../../Domains/comments/entities'

export interface Payload {
  threadId: string
}

export default class GetThreadWithCommentsAndRepliesUseCase {
  constructor (
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly replyRepository: ReplyRepository,
    private readonly deletedCommentContentMask: string = '**deleted**',
    private readonly deletedReplyContentMask: string = '**deleted**'
  ) {}

  async execute ({ threadId }: Payload): Promise<Thread<ThreadComment>> {
    const thread = await this.threadRepository.getThreadById(threadId) as Thread<ThreadComment>
    const [comments, replies] = await Promise.all([
      this.commentRepository.getCommentsByThreadId(threadId),
      this.replyRepository.getRepliesByThreadId(threadId)
    ])
    thread.comments = this.transformComments(comments, replies)
    return thread
  }

  protected transformComments (comments: ThreadComment[], replies: CommentReply[]): ThreadComment[] {
    comments.forEach(comment => {
      comment.replies = replies.filter(this.makeReplyTransformerFilter(comment.id))

      // Mask deleted comment's content
      if (comment.deleted_at !== null) {
        comment.content = this.deletedCommentContentMask
      }

      // Strip uneneded fields
      comment.deleted_at = undefined
    })
    return comments
  }

  protected makeReplyTransformerFilter = (commentId: string) => (reply: CommentReply): boolean => {
    if (reply.comment_id !== commentId) return false

    // Mask deleted reply's content
    if (reply.deleted_at !== null) {
      reply.content = this.deletedReplyContentMask
    }

    // Strip unneeded fields
    reply.comment_id = undefined
    reply.deleted_at = undefined

    return true
  }
}
