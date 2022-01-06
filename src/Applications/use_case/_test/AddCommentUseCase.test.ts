import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import AddCommentUseCase, { Payload } from '../AddCommentUseCase'
import { AddedComment, NewComment } from '../../../Domains/comments/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'
import ThreadRepository from '../../../Domains/threads/ThreadRepository'

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange inputs
    const useCasePayload: Payload = {
      thread_id: `thread-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs(),
      owner: `user-${faker.datatype.uuid()}`
    }

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
