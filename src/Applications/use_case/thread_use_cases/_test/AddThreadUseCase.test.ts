import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { AddedThread } from '../../../../Domains/threads/entities'
import ThreadRepository from '../../../../Domains/threads/ThreadRepository'
import AddThreadUseCase from '../AddThreadUseCase'

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange inputs
    const useCasePayload = {
      title: faker.lorem.words(5),
      body: faker.lorem.paragraphs(),
      owner: `user-${faker.datatype.uuid()}`
    }

    // Arrange UseCase's dependencies
    const expectedAddedThread = new AddedThread({
      id: `thread-${faker.datatype.uuid()}`,
      title: useCasePayload.title,
      owner: useCasePayload.owner
    })
    const threadRepository = createMock<ThreadRepository>()
    const spyAddThreadMethod: jest.Mock = On(threadRepository)
      .get(method(method => method.addThread))
      .mockResolvedValue(expectedAddedThread)

    // Action
    const addThreadUseCase = new AddThreadUseCase(threadRepository)
    const addedThread = await addThreadUseCase.execute(useCasePayload)

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread)
    expect(spyAddThreadMethod).toBeCalledWith(useCasePayload)
  })
})
