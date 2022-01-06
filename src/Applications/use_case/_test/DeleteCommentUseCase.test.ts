import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { NotFoundError } from '../../../Commons/exceptions'
import { Comment } from '../../../Domains/comments/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import DeleteCommentUseCase, { Payload } from '../DeleteCommentUseCase'

const generateComment = (): Comment => new Comment({
  id: `id-${faker.datatype.uuid()}`,
  thread_id: `thread-${faker.datatype.uuid()}`,
  owner: `user-${faker.datatype.uuid()}`,
  content: faker.lorem.paragraphs(),
  date: faker.datatype.datetime().toISOString(),
  deleted_at: null
})

describe('DeleteCommentUseCase', () => {
  it('should reject when the comment does not exist', async () => {
    // Arrange inputs
    const useCasePayload: Payload = {
      userId: `user-${faker.datatype.uuid()}`,
      commentId: `comment-${faker.datatype.uuid()}`
    }

    // Arrange doubles
    const notFoundError = new NotFoundError()
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentById: On(commentRepository)
        .get(method(method => method.getCommentById))
        .mockRejectedValue(notFoundError)
    }

    // Action
    const useCase = new DeleteCommentUseCase(commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError(notFoundError)
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.commentId)
  })

  it('should reject when user is not the owner of the comment', async () => {
    // Arrange doubles
    const comment = generateComment()
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentById: On(commentRepository)
        .get(method(method => method.getCommentById))
        .mockResolvedValue(comment)
    }

    // Arrange inputs
    const useCasePayload: Payload = {
      userId: `user-${faker.datatype.uuid()}`, // another user
      commentId: comment.id
    }

    // Action
    const useCase = new DeleteCommentUseCase(commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_COMMENT.USER_IS_NOT_OWNER')
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.commentId)
  })

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange doubles
    const comment = generateComment()
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentById: On(commentRepository)
        .get(method(method => method.getCommentById))
        .mockResolvedValue(comment),
      deleteCommentById: On(commentRepository)
        .get(method(method => method.deleteCommentById))
        .mockImplementation(async () => await Promise.resolve())
    }

    // Arrange inputs
    const useCasePayload: Payload = {
      userId: comment.owner,
      commentId: comment.id
    }

    // Action
    const useCase = new DeleteCommentUseCase(commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).resolves.not.toThrow()
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.commentId)
    expect(commentRepositoryMocks.deleteCommentById).toBeCalledWith(useCasePayload.commentId)
  })
})
