import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { AddedComment, NewComment } from '../../../Domains/comments/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import AddCommentUseCase, { Payload } from '../AddCommentUseCase'

const generatePayload = (): Payload => ({
  thread_id: `thread-${faker.datatype.uuid()}`,
  content: faker.lorem.paragraphs(),
  owner: `user-${faker.datatype.uuid()}`
})

describe('AddCommentUseCase', () => {
  it('should reject when Thread does not exist', async () => {
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
    const useCase = new AddCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('NEW_COMMENT.THREAD_NOT_FOUND')
    expect(threadRepositoryMocks.getThreadById).toBeCalledWith(useCasePayload.thread_id)
  })

  it('should orchestrate the Comment adding action correctly', async () => {
    // Arrange inputs
    const useCasePayload = generatePayload()

    // Arrange doubles
    const newComment = new NewComment(useCasePayload)
    const addedComment = new AddedComment({
      id: `comment-${faker.datatype.uuid()}`,
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })
    const threadRepository = createMock<ThreadRepository>()
    const commentRepository = createMock<CommentRepository>()
    const commentRepositoryMocks = {
      addComment: On(commentRepository)
        .get(method(method => method.addComment))
        .mockResolvedValue(addedComment)
    }

    // Arrange
    const expectedAddedComment = Object.assign(addedComment)

    // Action
    const useCase = new AddCommentUseCase(threadRepository, commentRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).resolves.toStrictEqual(expectedAddedComment)
    expect(commentRepositoryMocks.addComment).toBeCalledWith(newComment)
  })
})
