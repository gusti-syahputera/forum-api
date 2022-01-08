import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { NewAuth } from '../../../Domains/authentications/entities'
import UserRepository from '../../../Domains/users/UserRepository'
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager'
import PasswordHash from '../../security/PasswordHash'
import LoginUserUseCase from '../LoginUserUseCase'

describe('LoginUserUseCase', () => {
  it('should orchestrate the get authentication action correctly', async () => {
    // Arrange UserRepository's mock
    const userRepository = createMock<UserRepository>()
    const userId = `user-${faker.internet.userName()}`
    const hashedPassword = faker.internet.password()
    const userRepositoryMocks = {
      getIdByUsername: On(userRepository)
        .get(method('getIdByUsername'))
        .mockReturnValue(userId),
      getPasswordByUsername: On(userRepository)
        .get(method('getPasswordByUsername'))
        .mockResolvedValue(hashedPassword)
    }

    // Arrange AuthenticationRepository's mock
    const authenticationRepository = createMock<AuthenticationRepository>()
    const authenticationRepositoryMocks = {
      addToken: On(authenticationRepository)
        .get(method('addToken'))
        .mockImplementation(async () => await Promise.resolve())
    }

    // Arrange AuthenticationTokenManager's mock
    const accessToken = faker.datatype.hexaDecimal(64)
    const refreshToken = faker.datatype.hexaDecimal(64)
    const authenticationTokenManager = createMock<AuthenticationTokenManager>()
    const authenticationTokenManagerMocks = {
      createAccessToken: On(authenticationTokenManager)
        .get(method('createAccessToken'))
        .mockResolvedValue(accessToken),
      createRefreshToken: On(authenticationTokenManager)
        .get(method('createRefreshToken'))
        .mockResolvedValue(refreshToken)
    }

    // Arrange PasswordHash's mock
    const passwordHash = createMock<PasswordHash>()
    const passwordHashMocks = {
      comparePassword: On(passwordHash)
        .get(method('comparePassword'))
        .mockImplementation(async () => await Promise.resolve())
    }

    // Arrange input
    const useCasePayload = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    }

    // Action
    const useCase = new LoginUserUseCase(userRepository, authenticationRepository, authenticationTokenManager, passwordHash)
    const promise = useCase.execute(useCasePayload)

    // Assert
    const expectedAuthentication = new NewAuth({ accessToken, refreshToken })
    await expect(promise).resolves.toMatchObject(expectedAuthentication)
    expect(userRepositoryMocks.getPasswordByUsername)
      .toBeCalledWith(useCasePayload.username)
    expect(passwordHashMocks.comparePassword)
      .toBeCalledWith(useCasePayload.password, hashedPassword)
    expect(userRepositoryMocks.getIdByUsername)
      .toBeCalledWith(useCasePayload.username)

    const expectedTokenPayload = {
      username: useCasePayload.username,
      sub: userId
    }
    expect(authenticationTokenManagerMocks.createAccessToken)
      .toBeCalledWith(expectedTokenPayload)
    expect(authenticationTokenManagerMocks.createRefreshToken)
      .toBeCalledWith(expectedTokenPayload)

    expect(authenticationRepositoryMocks.addToken)
      .toBeCalledWith(expectedAuthentication.refreshToken)
  })
})
