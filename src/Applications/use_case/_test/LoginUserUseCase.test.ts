import { NewAuth } from '../../../Domains/authentications/entities'
import UserRepository from '../../../Domains/users/UserRepository'
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager'
import PasswordHash from '../../security/PasswordHash'
import LoginUserUseCase from '../LoginUserUseCase'

const instantAsyncFunc = async (): Promise<any> => await Promise.resolve()

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret'
    }
    const expectedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    })

    // Mocked dependencies
    const mockUserRepository: UserRepository = {
      addUser: jest.fn().mockImplementation(instantAsyncFunc),
      getIdByUsername: jest.fn().mockImplementation(async () => 'user-123'),
      getPasswordByUsername: jest.fn().mockImplementation(async () => 'encrypted_password'),
      verifyAvailableUsername: jest.fn().mockImplementation(instantAsyncFunc)
    }
    const mockAuthenticationRepository: AuthenticationRepository = {
      addToken: jest.fn().mockImplementation(async () => await Promise.resolve()),
      checkAvailabilityToken: jest.fn().mockImplementation(instantAsyncFunc),
      deleteToken: jest.fn().mockImplementation(instantAsyncFunc)
    }
    const mockAuthenticationTokenManager: AuthenticationTokenManager = {
      createAccessToken: jest.fn().mockImplementation(async () => expectedAuthentication.accessToken),
      createRefreshToken: jest.fn().mockImplementation(async () => expectedAuthentication.refreshToken),
      decodePayload: jest.fn().mockImplementation(instantAsyncFunc),
      verifyRefreshToken: jest.fn().mockImplementation(instantAsyncFunc)
    }
    const mockPasswordHash: PasswordHash = {
      comparePassword: jest.fn().mockImplementation(instantAsyncFunc),
      hash: jest.fn().mockImplementation(instantAsyncFunc)
    }

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase(
      mockUserRepository,
      mockAuthenticationRepository,
      mockAuthenticationTokenManager,
      mockPasswordHash
    )

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload)

    // Assert
    expect(actualAuthentication).toEqual(expectedAuthentication)
    expect(mockUserRepository.getPasswordByUsername)
      .toBeCalledWith('dicoding')
    expect(mockPasswordHash.comparePassword)
      .toBeCalledWith('secret', 'encrypted_password')
    expect(mockUserRepository.getIdByUsername)
      .toBeCalledWith('dicoding')
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', sub: 'user-123' })
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ username: 'dicoding', sub: 'user-123' })
    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith(expectedAuthentication.refreshToken)
  })
})
