import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { AddedReply, NewReply } from '../../../Domains/replies/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import ReplyRepository from '../../../Domains/replies/ReplyRepository'
import AddReplyUseCase, { Payload } from '../AddReplyUseCase'

const generatePayload = (): Payload => ({
  thread_id: `thread-${faker.datatype.uuid()}`,
  comment_id: `comment-${faker.datatype.uuid()}`,
  content: faker.lorem.paragraphs(),
  owner: `user-${faker.datatype.uuid()}`
})

describe('AddReplyUseCase', () => {
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
    const useCase = new AddReplyUseCase(threadRepository, commentRepository, replyRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('NEW_REPLY.THREAD_NOT_FOUND')
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.thread_id)
  })

  it('should reject when the Comment does not exist', async () => {
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
    const useCase = new AddReplyUseCase(threadRepository, commentRepository, replyRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('NEW_REPLY.COMMENT_NOT_FOUND')
    expect(commentRepositoryMocks.getCommentById).toBeCalledWith(useCasePayload.comment_id)
  })

  it('should orchestrate the Reply adding action correctly', async () => {
    // Arrange inputs
    const useCasePayload: Payload = {
      thread_id: `thread-${faker.datatype.uuid()}`,
      comment_id: `comment-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs(),
      owner: `user-${faker.datatype.uuid()}`
    }

    // Arrange doubles

    const newReply = new NewReply(useCasePayload)
    const addedReply = new AddedReply({
      id: `reply-${faker.datatype.uuid()}`,
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })
    const replyRepository = createMock<ReplyRepository>()
    const replyRepositoryMocks = {
      addReply: On(replyRepository)
        .get(method(method => method.addReply))
        .mockResolvedValue(addedReply)
    }

    const commentRepository = createMock<CommentRepository>()
    const threadRepository = createMock<ThreadRepository>()

    // Arrange
    const expectedAddedReply = Object.assign(addedReply)

    // Action
    const useCase = new AddReplyUseCase(threadRepository, commentRepository, replyRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).resolves.toStrictEqual(expectedAddedReply)
    expect(replyRepositoryMocks.addReply).toBeCalledWith(newReply)
  })
})
