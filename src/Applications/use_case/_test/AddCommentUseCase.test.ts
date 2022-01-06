import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import AddCommentUseCase, { Payload } from '../AddCommentUseCase'
import { AddedComment } from '../../../Domains/comments/entities'
import CommentRepository from '../../../Domains/comments/CommentRepository'

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange inputs
    const useCasePayload: Payload = {
      thread_id: `thread-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs(),
      owner: `user-${faker.datatype.uuid()}`
    }

    // Arrange UseCase's dependencies
    const expectedAddedComment = new AddedComment({
      id: `thread-${faker.datatype.uuid()}`,
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })
    const commentRepository = createMock<CommentRepository>()
    const spyAddCommentMethod: jest.Mock = On(commentRepository)
      .get(method(method => method.addComment))
      .mockResolvedValue(expectedAddedComment)

    // Action
    const useCase = new AddCommentUseCase(commentRepository)
    const addedComment = await useCase.execute(useCasePayload)

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment)
    expect(spyAddCommentMethod).toBeCalledWith(useCasePayload)
  })
})
