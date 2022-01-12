import { CommentLike } from './entities'

export default interface CommentLikeRepository {
  addLike: (like: CommentLike) => Promise<void>
  deleteLike: (like: CommentLike) => Promise<void>
}
