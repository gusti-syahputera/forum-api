import { AddedComment, Comment, NewComment } from './entities'

export default interface CommentRepository {
  addComment: (newComment: NewComment) => Promise<AddedComment>
  deleteCommentById: (id: string) => Promise<void>
  getCommentById: (id: string) => Promise<Comment>
}
