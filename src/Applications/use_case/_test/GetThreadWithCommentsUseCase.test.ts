import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { Comment } from '../../../Domains/comments/entities'
import { Thread } from '../../../Domains/threads/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import GetThreadWithCommentsUseCase, { Payload } from '../GetThreadWithCommentsUseCase'

describe('GetThreadWithCommentsUseCase', () => {
  it('should orchestrate the thread getting action correctly', async () => {
    // Arrange inputs
    const useCasePayload: Payload = {
      threadId: `thread-${faker.datatype.uuid()}`
    }

    // Arrange doubles

    const thread = new Thread<Comment>({
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

    const comments = [...Array(10).keys()].map<Comment>(_ => new Comment({
      id: `comment-${faker.datatype.uuid()}`,
      thread_id: thread.id,
      owner: `user-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs(),
      date: faker.datatype.datetime().toISOString(),
      deleted_at: faker.random.arrayElement([faker.datatype.datetime().toISOString(), null])
    }))
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      getCommentsByThreadId: On(commentRepository)
        .get(method(method => method.getCommentsByThreadId))
        .mockResolvedValue(comments)
    }

    // Arrange expectations
    const deletedCommentContentMask = '**deleted comment**'
    const expectedComments = JSON.parse(JSON.stringify(comments))
    expectedComments.forEach(comment => {
      if (comment.deleted_at !== null) {
        comment.content = deletedCommentContentMask
      }
      comment.deleted_at = undefined
    })
    const expectedThread = Object.assign(thread) as Thread<Comment>
    expectedThread.comments = expectedComments

    // Action
    const useCase = new GetThreadWithCommentsUseCase(threadRepository, commentRepository, deletedCommentContentMask)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await Promise.all([
      expect(promise).resolves.toMatchObject(expectedThread),
      expect(promise).resolves.toEqual(expect.objectContaining({ comments: expectedComments }))
    ])
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
    expect(commentRepositoryMocks.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId)
  })
})
