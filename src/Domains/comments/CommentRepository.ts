import { AddedComment, Comment, NewComment } from './entities'
import ThreadComment from './entities/ThreadComment'

export default interface CommentRepository {
  addComment: (newComment: NewComment) => Promise<AddedComment>
  deleteCommentById: (id: string) => Promise<void>
  getCommentById: (id: string) => Promise<Comment>
  getCommentsByThreadId: (threadId: string) => Promise<ThreadComment[]>
}
