import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { ThreadComment } from '../../../Domains/comments/entities'
import { Thread } from '../../../Domains/threads/entities'
import { CommentReply } from '../../../Domains/replies/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import ReplyRepository from '../../../Domains/replies/ReplyRepository'
import GetThreadWithCommentsAndRepliesUseCase, { Payload } from '../GetThreadWithCommentsAndRepliesUseCase'

describe('GetThreadWithCommentsAndRepliesUseCase', () => {
  it('should construct correctly', async () => {
    // Arrange
    const threadRepository = createMock<ThreadRepository>()
    const commentRepository = createMock<CommentRepository>()
    const replyRepository = createMock<ReplyRepository>()
    const customDeletedCommentMask = '**komen dihapus**'
    const customDeletedReplyMask = '**balasan dihapus**'

    // Action and Assert
    expect(() => new GetThreadWithCommentsAndRepliesUseCase(
      threadRepository, commentRepository, replyRepository
    )).not.toThrow()
    expect(() => new GetThreadWithCommentsAndRepliesUseCase(
      threadRepository, commentRepository, replyRepository,
      customDeletedCommentMask, customDeletedReplyMask
    )).not.toThrow()
  })

  it('should orchestrate the Thread getting action correctly', async () => {
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

    // Arrange Reply-related doubles
    const commentReplies = [...Array(28).keys()].map(() => new CommentReply({
      id: `reply-${faker.datatype.uuid()}`,
      comment_id: faker.random.arrayElement(threadComments).id,
      username: faker.internet.userName(),
      content: faker.lorem.paragraphs(),
      date: faker.datatype.datetime().toISOString(),
      deleted_at: faker.random.arrayElement([faker.datatype.datetime().toISOString(), null])
    }))
    const replyRepository = createMock<ReplyRepository>()
    const replyRepositoryMocks = {
      getRepliesByThreadId: On(replyRepository)
        .get(method(method => method.getRepliesByThreadId))
        .mockResolvedValue(commentReplies)
    }

    // Arrange expectations
    const deletedCommentContentMask = '**deleted comment**'
    const deletedReplyContentMask = '**deleted reply**'
    const _threadComments = threadComments.map(threadComment => Object.assign({}, threadComment) as ThreadComment<CommentReply>)
    const _commentReplies = commentReplies.map(commentReply => Object.assign({}, commentReply))
    _threadComments.forEach(comment => {
      comment.replies = _commentReplies.filter(reply => reply.comment_id === comment.id)
      if (comment.deleted_at !== null) {
        comment.content = deletedCommentContentMask
      }
      comment.deleted_at = undefined
    })
    _commentReplies.forEach(reply => {
      if (reply.deleted_at !== null) {
        reply.content = deletedReplyContentMask
      }
      reply.comment_id = undefined
      reply.deleted_at = undefined
    })
    const expectedThread = Object.assign({}, thread) as Thread<ThreadComment<CommentReply>>
    expectedThread.comments = _threadComments

    // Action
    const useCase = new GetThreadWithCommentsAndRepliesUseCase(
      threadRepository, commentRepository, replyRepository,
      deletedCommentContentMask, deletedReplyContentMask
    )
    const promise = useCase.execute(useCasePayload)

    // Assert
    await Promise.all([
      expect(promise).resolves.toMatchObject(expectedThread),
      expect(promise).resolves.toEqual(expect.objectContaining({ comments: expectedThread.comments }))
    ])
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.threadId)
    expect(commentRepositoryMocks.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId)
    expect(replyRepositoryMocks.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId)
  })
})
