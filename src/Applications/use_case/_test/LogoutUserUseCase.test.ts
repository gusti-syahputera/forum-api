import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import LogoutUserUseCase from '../LogoutUserUseCase'

describe('LogoutUserUseCase', () => {
  it('should reject if use case payload does not contain refresh token', async () => {
    // Arrange doubles
    const authenticationRepository = createMock<AuthenticationRepository>()

    // Arrange input
    const useCasePayload = {}

    // Action
    const useCase = new LogoutUserUseCase(authenticationRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should reject if refresh token is not string', async () => {
    // Arrange doubles
    const authenticationRepository = createMock<AuthenticationRepository>()

    // Arrange input
    const useCasePayload = {
      refreshToken: faker.datatype.array()
    }

    // Action
    const useCase = new LogoutUserUseCase(authenticationRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrate the delete authentication action correctly', async () => {
    // Arrange doubles
    const authenticationRepository = createMock<AuthenticationRepository>()
    const authenticationRepositoryMocks = {
      checkAvailabilityToken: On(authenticationRepository)
        .get(method('checkAvailabilityToken'))
        .mockImplementation(async () => await Promise.resolve()),
      deleteToken: On(authenticationRepository)
        .get(method('deleteToken'))
        .mockImplementation(async () => await Promise.resolve())
    }

    // Arrange input
    const useCasePayload = {
      refreshToken: faker.datatype.hexaDecimal(64)
    }

    // Action
    const useCase = new LogoutUserUseCase(authenticationRepository)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).resolves.not.toThrow()
    expect(authenticationRepositoryMocks.checkAvailabilityToken).toBeCalledWith(useCasePayload.refreshToken)
    expect(authenticationRepositoryMocks.deleteToken).toBeCalledWith(useCasePayload.refreshToken)
  })
})
