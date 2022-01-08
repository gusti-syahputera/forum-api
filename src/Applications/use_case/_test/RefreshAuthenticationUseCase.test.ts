import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager'
import RefreshAuthenticationUseCase from '../RefreshAuthenticationUseCase'

describe('RefreshAuthenticationUseCase', () => {
  it('should reject if payload does not contain refresh token', async () => {
    // Arrange doubles
    const authenticationRepository = createMock<AuthenticationRepository>()
    const authenticationTokenManager = createMock<AuthenticationTokenManager>()

    // Arrange input
    const useCasePayload = {}

    // Action
    const useCase = new RefreshAuthenticationUseCase(authenticationRepository, authenticationTokenManager)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should reject if refresh token is not string', async () => {
    // Arrange doubles
    const authenticationRepository = createMock<AuthenticationRepository>()
    const authenticationTokenManager = createMock<AuthenticationTokenManager>()

    // Arrange input
    const useCasePayload = {
      refreshToken: faker.datatype.number()
    }

    // Action
    const useCase = new RefreshAuthenticationUseCase(authenticationRepository, authenticationTokenManager)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrate the refresh authentication action correctly', async () => {
    // Arrange doubles
    const authenticationRepository = createMock<AuthenticationRepository>()
    const authenticationRepositoryMocks = {
      checkAvailabilityToken: On(authenticationRepository)
        .get(method('checkAvailabilityToken'))
        .mockImplementation(async () => await Promise.resolve())
    }

    const tokenPayload = {
      username: faker.internet.userName(),
      id: `user-${faker.datatype.uuid()}`
    }
    const accessToken = faker.datatype.hexaDecimal(64)
    const authenticationTokenManager = createMock<AuthenticationTokenManager>()
    const authenticationTokenManagerMocks = {
      decodePayload: On(authenticationTokenManager)
        .get(method('decodePayload'))
        .mockResolvedValue(tokenPayload),
      createAccessToken: On(authenticationTokenManager)
        .get(method('createAccessToken'))
        .mockResolvedValue(accessToken)
    }

    // Arrange input
    const useCasePayload = {
      refreshToken: faker.datatype.hexaDecimal(64)
    }

    // Action
    const useCase = new RefreshAuthenticationUseCase(authenticationRepository, authenticationTokenManager)
    const promise = useCase.execute(useCasePayload)

    // Assert
    await expect(promise).resolves.toStrictEqual(accessToken)
    expect(authenticationRepositoryMocks.checkAvailabilityToken)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(authenticationTokenManagerMocks.decodePayload)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(authenticationTokenManagerMocks.createAccessToken)
      .toBeCalledWith(tokenPayload)
  })
})
