import { AddedComment, Comment, NewComment, ThreadComment } from './entities'

export default interface CommentRepository {
  addComment: (newComment: NewComment) => Promise<AddedComment>
  deleteCommentById: (id: string) => Promise<void>
  getCommentById: (id: string) => Promise<Comment>
  getCommentsByThreadId: (threadId: string) => Promise<ThreadComment[]>
}
