import { AddedReply, CommentReply, NewReply, Reply } from './entities'

export default interface ReplyRepository {
  addReply: (newReply: NewReply) => Promise<AddedReply>
  deleteReplyById: (id: string) => Promise<void>
  getReplyById: (id: string) => Promise<Reply>
  getRepliesByThreadId: (threadId: string) => Promise<CommentReply[]>
}
