import CommentRepository from '../../Domains/comments/CommentRepository'
import { AddedComment, NewComment } from '../../Domains/comments/entities'

export interface Payload {
  thread_id: string
  owner: string
  content: string
}

export default class AddCommentUseCase {
  constructor (
    private readonly commentRepository: CommentRepository
  ) {}

  execute = async (useCasePayload: Payload): Promise<AddedComment> => {
    const newComment = new NewComment(useCasePayload)
    return await this.commentRepository.addComment(newComment)
  }
}
