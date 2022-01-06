import CommentRepository from '../../Domains/comments/CommentRepository'
import { AuthorizationError } from '../../Commons/exceptions'

export interface Payload {
  userId: string
  commentId: string
}

export default class DeleteCommentUseCase {
  constructor (
    private readonly commentRepository: CommentRepository
  ) {}

  execute = async ({ userId, commentId }: Payload): Promise<void> => {
    // Assert that user is the comment's owner
    const { owner: ownerId } = await this.commentRepository.getCommentById(commentId)
    if (ownerId !== userId) {
      throw new AuthorizationError('DELETE_COMMENT.USER_IS_NOT_OWNER')
    }

    // Proceed to delete
    return await this.commentRepository.deleteCommentById(commentId)
  }
}
