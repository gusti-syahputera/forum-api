import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { Comment } from '../../../Domains/comments/entities'
import { Reply } from '../../../Domains/replies/entities'
import { Thread } from '../../../Domains/threads/entities'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import ReplyRepository from '../../../Domains/replies/ReplyRepository'
import DeleteReplyUseCase, { Payload } from '../DeleteReplyUseCase'

const generatePayload = (): Payload => ({
  userId: `user-${faker.datatype.uuid()}`, // another user
  threadId: `thread-${faker.datatype.uuid()}`,
  commentId: `comment-${faker.datatype.uuid()}`,
  replyId: `reply-${faker.datatype.uuid()}`
})

const generateReply = (
  commentId = `comment-${faker.datatype.uuid()}`
): Reply => new Reply({
  id: `reply-${faker.datatype.uuid()}`,
  comment_id: commentId,
  owner: `user-${faker.datatype.uuid()}`,
  content: faker.lorem.paragraphs(),
  date: faker.datatype.datetime().toISOString(),
  deleted_at: null
})

const generateComment = (
  threadId = `thread-${faker.datatype.uuid()}`
): Comment => new Comment({
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

describe('DeleteReplyUseCase', () => {
  it('should reject when Thread does not exist', async () => {
    // Arrange doubles
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockRejectedValue(new Error('THREAD.NOT_FOUND'))
    }
    const commentRepository = createMock<CommentRepository>()
    const replyRepository = createMock<ReplyRepository>()

    // Arrange inputs
    const useCasePayload = generatePayload()

    // Action
    const useCase = new DeleteReplyUseCase(threadRepository, commentRepository, replyRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_REPLY.THREAD_NOT_FOUND')
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
  })

  it('should reject when Comment does not exist', async () => {
    // Arrange doubles
    const threadRepository = createMock<ThreadRepository>()
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentById: On(commentRepository)
        .get(method(method => method.getCommentById))
        .mockRejectedValue(new Error('COMMENT.NOT_FOUND'))
    }
    const replyRepository = createMock<ReplyRepository>()

    // Arrange inputs
    const useCasePayload = generatePayload()

    // Action
    const useCase = new DeleteReplyUseCase(threadRepository, commentRepository, replyRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_REPLY.COMMENT_NOT_FOUND')
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.commentId)
  })

  it('should reject when Reply does not exist', async () => {
    // Arrange doubles
    const threadRepository = createMock<ThreadRepository>()
    const commentRepository = createMock<CommentRepository>()
    const replyRepository = createMock<ReplyRepository>()
    const replyRepositoryMocks = {
      getReplyById: On(replyRepository)
        .get(method(method => method.getReplyById))
        .mockRejectedValue(new Error('REPLY.NOT_FOUND'))
    }

    // Arrange inputs
    const useCasePayload = generatePayload()

    // Action
    const useCase = new DeleteReplyUseCase(threadRepository, commentRepository, replyRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_REPLY.REPLY_NOT_FOUND')
    expect(replyRepositoryMocks.getReplyById).toBeCalledWith(useCasePayload.replyId)
  })

  it('should reject when User is not the owner of Reply', async () => {
    // Arrange doubles
    const threadRepository = createMock<ThreadRepository>()
    const commentRepository = createMock<CommentRepository>()
    const replyRepository = createMock<ReplyRepository>()
    const reply = generateReply()

    // Arrange inputs
    const useCasePayload = generatePayload()
    useCasePayload.replyId = reply.id

    // Action
    const useCase = new DeleteReplyUseCase(threadRepository, commentRepository, replyRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_REPLY.USER_IS_NOT_OWNER')
  })

  it('should orchestrate the delete Reply action correctly', async () => {
    // Arrange Thread-related doubles
    const thread = generateThread()
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockResolvedValue(thread)
    }

    // Arrange Comment-related doubles
    const comment = generateComment(thread.id)
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentById: On(commentRepository)
        .get(method(method => method.getCommentById))
        .mockResolvedValue(comment)
    }

    // Arrang Reply-related doubles
    const reply = generateReply(comment.id)
    const replyRepository = createMock<ReplyRepository>()
    const replyRepositoryMocks = {
      getReplyById: On(replyRepository)
        .get(method(method => method.getReplyById))
        .mockResolvedValue(reply),
      deleteReplyById: On(replyRepository)
        .get(method(method => method.deleteReplyById))
        .mockImplementation(async () => await Promise.resolve())
    }
    // Arrange inputs
    const useCasePayload: Payload = {
      userId: reply.owner,
      threadId: thread.id,
      commentId: comment.id,
      replyId: reply.id
    }

    // Action
    const useCase = new DeleteReplyUseCase(threadRepository, commentRepository, replyRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).resolves.not.toThrow()
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.commentId)
    expect(replyRepositoryMocks.getReplyById).toBeCalledWith(useCasePayload.replyId)
    expect(replyRepositoryMocks.deleteReplyById).toBeCalledWith(useCasePayload.replyId)
  })
})
