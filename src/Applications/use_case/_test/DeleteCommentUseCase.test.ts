import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { NotFoundError } from '../../../Commons/exceptions'
import { Comment } from '../../../Domains/comments/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import DeleteCommentUseCase, { Payload } from '../DeleteCommentUseCase'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import { Thread } from '../../../Domains/threads/entities'

const generateComment = (threadId = `thread-${faker.datatype.uuid()}`): Comment => new Comment({
  id: `comment-${faker.datatype.uuid()}`,
  thread_id: threadId,
  owner: `user-${faker.datatype.uuid()}`,
  content: faker.lorem.paragraphs(),
  date: faker.datatype.datetime().toISOString(),
  deleted_at: null
})

const generateThread = (id = `thread-${faker.datatype.uuid()}`): Thread => new Thread({
  id,
  title: faker.lorem.words(),
  body: faker.lorem.paragraphs(),
  username: faker.internet.userName(),
  date: faker.datatype.datetime().toISOString()
})

describe('DeleteCommentUseCase', () => {
  it('should reject when the thread does not exist', async () => {
    // Arrange inputs
    const useCasePayload: Payload = {
      userId: `user-${faker.datatype.uuid()}`,
      threadId: `thread-${faker.datatype.uuid()}`,
      commentId: `comment-${faker.datatype.uuid()}`
    }

    // Arrange doubles
    const notFoundError = new NotFoundError()
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockRejectedValue(notFoundError)
    }
    const commentRepository = createMock<CommentRepository>()

    // Action
    const useCase = new DeleteCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError(notFoundError)
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
  })

  it('should reject when the comment does not belong to the thread', async () => {
    // Arrange inputs
    const useCasePayload: Payload = {
      userId: `user-${faker.datatype.uuid()}`,
      threadId: `thread-${faker.datatype.uuid()}`,
      commentId: `comment-${faker.datatype.uuid()}`
    }

    // Arrange doubles
    const notFoundError = new NotFoundError('DELETE_COMMENT.COMMENT_DOES_NOT_BELONG_TO_THREAD')
    const commentRepository = createMock<CommentRepository>()

    const thread = generateThread(useCasePayload.threadId)
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockResolvedValue(thread)
    }

    // Action
    const useCase = new DeleteCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError(notFoundError)
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(thread.id)
  })

  it('should reject when the comment does not exist', async () => {
    // Arrange inputs
    const useCasePayload: Payload = {
      userId: `user-${faker.datatype.uuid()}`,
      threadId: `thread-${faker.datatype.uuid()}`,
      commentId: `comment-${faker.datatype.uuid()}`
    }

    // Arrange doubles
    const thread = generateThread(useCasePayload.threadId)
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockResolvedValue(thread)
    }

    const notFoundError = new NotFoundError()
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentById: On(commentRepository)
        .get(method(method => method.getCommentById))
        .mockRejectedValue(notFoundError)
    }

    // Action
    const useCase = new DeleteCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError(notFoundError)
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.commentId)
  })

  it('should reject when user is not the owner of the comment', async () => {
    // Arrange doubles
    const thread = generateThread()
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockResolvedValue(thread)
    }
    const comment = generateComment(thread.id)
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentById: On(commentRepository)
        .get(method(method => method.getCommentById))
        .mockResolvedValue(comment)
    }

    // Arrange inputs
    const useCasePayload: Payload = {
      userId: `user-${faker.datatype.uuid()}`, // another user
      threadId: thread.id,
      commentId: comment.id
    }

    // Action
    const useCase = new DeleteCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_COMMENT.USER_IS_NOT_OWNER')
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.commentId)
  })

  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange doubles
    const thread = generateThread()
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockResolvedValue(thread)
    }
    const comment = generateComment(thread.id)
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
      threadId: thread.id,
      commentId: comment.id
    }

    // Action
    const useCase = new DeleteCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).resolves.not.toThrow()
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.commentId)
    expect(commentRepositoryMocks.deleteCommentById).toBeCalledWith(useCasePayload.commentId)
  })
})
