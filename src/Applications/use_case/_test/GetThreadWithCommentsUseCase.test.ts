import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { ThreadComment } from '../../../Domains/comments/entities'
import { Thread } from '../../../Domains/threads/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import GetThreadWithCommentsUseCase, { Payload } from '../GetThreadWithCommentsUseCase'
import { CommentReply } from '../../../Domains/replies/entities'

describe('GetThreadWithCommentsUseCase', () => {
  it('should construct correctly', async () => {
    // Arrange
    const threadRepository = createMock<ThreadRepository>()
    const commentRepository = createMock<CommentRepository>()
    const customDeletedCommentMask = '**komen dihapus**'

    // Action and Assert
    expect(() => new GetThreadWithCommentsUseCase(threadRepository, commentRepository)).not.toThrow()
    expect(() => new GetThreadWithCommentsUseCase(threadRepository, commentRepository, customDeletedCommentMask))
      .not.toThrow()
  })

  it('should orchestrate the thread getting action correctly', async () => {
    // Arrange inputs
    const useCasePayload: Payload = {
      threadId: `thread-${faker.datatype.uuid()}`
    }

    // Arrange Thread-related doubles
    const thread = new Thread<ThreadComment>({
      id: useCasePayload.threadId,
      body: faker.lorem.paragraphs(),
      title: faker.lorem.words(),
      username: faker.internet.userName(),
      comments: [],
      date: faker.datatype.datetime().toISOString()
    })
    const threadRepository = createMock<ThreadRepository>()
    const threadRepositoryMocks = {
      getThreadById: On(threadRepository)
        .get(method(method => method.getThreadById))
        .mockResolvedValue(thread)
    }

    // Arrange Comment-related doubles
    const threadComments = [...Array(4).keys()].map(() => new ThreadComment({
      id: `comment-${faker.datatype.uuid()}`,
      thread_id: thread.id,
      username: faker.internet.userName(),
      content: faker.lorem.paragraphs(),
      date: faker.datatype.datetime().toISOString(),
      deleted_at: faker.random.arrayElement([faker.datatype.datetime().toISOString(), null])
    }))
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentsByThreadId: On(commentRepository)
        .get(method(method => method.getCommentsByThreadId))
        .mockResolvedValue(threadComments)
    }

    // Arrange expectations
    const deletedCommentContentMask = '**deleted comment**'
    const _threadComments = threadComments.map(threadComment => Object.assign({}, threadComment) as ThreadComment<CommentReply>)
    _threadComments.forEach(comment => {
      if (comment.deleted_at !== null) {
        comment.content = deletedCommentContentMask
      }
      comment.deleted_at = undefined
    })
    const expectedThread = Object.assign({}, thread)
    expectedThread.comments = _threadComments

    // Action
    const useCase = new GetThreadWithCommentsUseCase(threadRepository, commentRepository, deletedCommentContentMask)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await Promise.all([
      expect(promise).resolves.toMatchObject(expectedThread),
      expect(promise).resolves.toEqual(expect.objectContaining({ comments: expectedThread.comments }))
    ])
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
    expect(commentRepositoryMocks.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId)
  })
})
