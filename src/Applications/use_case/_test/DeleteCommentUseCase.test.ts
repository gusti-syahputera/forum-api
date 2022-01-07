import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { Comment } from '../../../Domains/comments/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import DeleteCommentUseCase, { Payload } from '../DeleteCommentUseCase'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import { Thread } from '../../../Domains/threads/entities'

const generatePayload = (): Payload => ({
  userId: `user-${faker.datatype.uuid()}`,
  threadId: `thread-${faker.datatype.uuid()}`,
  commentId: `comment-${faker.datatype.uuid()}`
})

const generateComment = (threadId = `thread-${faker.datatype.uuid()}`): Comment => new Comment({
  id: `comment-${faker.datatype.uuid()}`,
  thread_id: threadId,
  owner: `user-${faker.datatype.uuid()}`,
  content: faker.lorem.paragraphs(),
  date: faker.datatype.datetime().toISOString(),
  deleted_at: null
})

const generateThread = (): Thread => new Thread({
  id: `thread-${faker.datatype.uuid()}`,
  title: faker.lorem.words(),
  body: faker.lorem.paragraphs(),
  username: faker.internet.userName(),
  date: faker.datatype.datetime().toISOString()
})

describe('DeleteCommentUseCase', () => {
  it('should reject when the Thread does not exist', async () => {
    // Arrange doubles
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockRejectedValue(new Error('THREAD.NOT_FOUND'))
    }
    const commentRepository = createMock<CommentRepository>()

    // Arrange inputs
    const useCasePayload = generatePayload()

    // Action
    const useCase = new DeleteCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_COMMENT.THREAD_NOT_FOUND')
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
  })

  it('should reject when Comment does not belong to Thread', async () => {
    // Arrange doubles
    const commentRepository = createMock<CommentRepository>()
    const thread = generateThread()
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockResolvedValue(thread)
    }

    // Arrange inputs
    const useCasePayload = generatePayload()
    useCasePayload.threadId = thread.id

    // Action
    const useCase = new DeleteCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_COMMENT.COMMENT_DOES_NOT_BELONG_TO_THREAD')
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(thread.id)
  })

  it('should reject when the Comment does not exist', async () => {
    // Arrange doubles
    const thread = generateThread()
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockResolvedValue(thread)
    }
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentById: On(commentRepository)
        .get(method(method => method.getCommentById))
        .mockRejectedValue(new Error('COMMENT.NOT_FOUND'))
    }

    // Arrange inputs
    const useCasePayload = generatePayload()
    useCasePayload.threadId = thread.id

    // Action
    const useCase = new DeleteCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_COMMENT.COMMENT_NOT_FOUND')
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
