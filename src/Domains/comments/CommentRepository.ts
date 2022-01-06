import { AddedComment, NewComment } from './entities'

export default interface CommentRepository {
  addComment: (newComment: NewComment) => Promise<AddedComment>
  deleteCommentById: (id: string) => Promise<void>
}
