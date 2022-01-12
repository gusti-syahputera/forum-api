import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { CommentLike } from '../../../Domains/comment-likes/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import CommentLikeRepository from '../../../Domains/comment-likes/CommentLikeRepository'
import ToggleCommentLikeUseCase, { Payload } from '../ToggleCommentLikeUseCase'

const generatePayload = (): Payload => ({
  thread_id: `thread-${faker.datatype.uuid()}`,
  comment_id: `comment-${faker.datatype.uuid()}`,
  user_id: `user-${faker.datatype.uuid()}`
})

describe('ToggleCommentLikeUseCase', () => {
  it('should reject when Thread does not exist', async () => {
    // Arrange doubles
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockRejectedValue(new Error('THREAD.NOT_FOUND'))
    }
    const commentRepository = createMock<CommentRepository>()
    const likeRepository = createMock<CommentLikeRepository>()

    // Arrange input
    const useCasePayload = generatePayload()

    // Action
    const useCase = new ToggleCommentLikeUseCase(threadRepository, commentRepository, likeRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('TOGGLE_LIKE.THREAD_NOT_FOUND')
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.thread_id)
  })

  it('should reject when the Comment does not exist', async () => {
    // Arrange doubles
    const threadRepository = createMock<ThreadRepository>()
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentById: On(commentRepository)
        .get(method('getCommentById'))
        .mockRejectedValue(new Error('COMMENT.NOT_FOUND'))
    }
    const likeRepository = createMock<CommentLikeRepository>()

    // Arrange input
    const useCasePayload = generatePayload()

    // Action
    const useCase = new ToggleCommentLikeUseCase(threadRepository, commentRepository, likeRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('TOGGLE_LIKE.COMMENT_NOT_FOUND')
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.comment_id)
  })

  describe('orchestrating the Like toggling action', () => {
    it('should try to add Like', async () => {
      // Arrange inputs
      const useCasePayload = generatePayload()

      // Arrange doubles
      const likeRepository = createMock<CommentLikeRepository>()
      const likeRepositoryMocks = {
        addLike: On(likeRepository)
          .get(method('addLike'))
          .mockImplementation(async () => await Promise.resolve())
      }
      const commentRepository = createMock<CommentRepository>()
      const threadRepository = createMock<ThreadRepository>()

      // Action
      const useCase = new ToggleCommentLikeUseCase(threadRepository, commentRepository, likeRepository)
      const promise = useCase.execute(useCasePayload)

      // Assert
      await expect(promise).resolves.not.toThrow()
      const expectedLike = new CommentLike(useCasePayload)
      expect(likeRepositoryMocks.addLike).toBeCalledWith(expectedLike)
    })

    it('should reject when failed to add Like caused by other reasons than unique key constraint violation', async () => {
      // Arrange doubles
      const likeRepository = createMock<CommentLikeRepository>()
      const unexpectedError = new Error()
      const likeRepositoryMocks = {
        addLike: On(likeRepository)
          .get(method('addLike'))
          .mockRejectedValue(unexpectedError)
      }
      const commentRepository = createMock<CommentRepository>()
      const threadRepository = createMock<ThreadRepository>()

      // Arrange input
      const useCasePayload = generatePayload()

      // Action
      const useCase = new ToggleCommentLikeUseCase(threadRepository, commentRepository, likeRepository)
      const promise = useCase.execute(useCasePayload)

      // Assert
      await expect(promise).rejects.toThrow(unexpectedError)
      const expectedLike = new CommentLike(useCasePayload)
      expect(likeRepositoryMocks.addLike).toBeCalledWith(expectedLike)
    })

    it('should remove existing Like', async () => {
      // Arrange doubles
      const likeRepository = createMock<CommentLikeRepository>()
      const likeRepositoryMocks = {
        addLike: On(likeRepository)
          .get(method('addLike'))
          .mockRejectedValue(new Error('ADD_LIKE.ALREADY_EXISTS')),
        deleteLike: On(likeRepository)
          .get(method('deleteLike'))
          .mockImplementation(async () => await Promise.resolve())
      }
      const commentRepository = createMock<CommentRepository>()
      const threadRepository = createMock<ThreadRepository>()

      // Arrange input
      const useCasePayload = generatePayload()

      // Action
      const useCase = new ToggleCommentLikeUseCase(threadRepository, commentRepository, likeRepository)
      const promise = useCase.execute(useCasePayload)

      // Assert
      await expect(promise).resolves.not.toThrow()
      const expectedLike = new CommentLike(useCasePayload)
      expect(likeRepositoryMocks.addLike).toBeCalledWith(expectedLike)
      expect(likeRepositoryMocks.deleteLike).toBeCalledWith(expectedLike)
    })
  })
})
