import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager'
import RefreshAuthenticationUseCase from '../RefreshAuthenticationUseCase'

const instantAsyncFunc = async (): Promise<any> => await Promise.resolve()

const getAuthenticationRepositoryMock = (): AuthenticationRepository => ({
  addToken: jest.fn().mockImplementation(instantAsyncFunc),
  checkAvailabilityToken: jest.fn().mockImplementation(instantAsyncFunc),
  deleteToken: jest.fn().mockImplementation(instantAsyncFunc)
})

const getAuthenticationTokenManagerMock = (): AuthenticationTokenManager => ({
  createAccessToken: jest.fn().mockImplementation(instantAsyncFunc),
  createRefreshToken: jest.fn().mockImplementation(instantAsyncFunc),
  decodePayload: jest.fn().mockImplementation(instantAsyncFunc),
  verifyRefreshToken: jest.fn().mockImplementation(instantAsyncFunc)
})

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      getAuthenticationRepositoryMock(),
      getAuthenticationTokenManagerMock()
    )

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 1
    }
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      getAuthenticationRepositoryMock(),
      getAuthenticationTokenManagerMock()
    )

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token'
    }
    const mockAuthenticationRepository = getAuthenticationRepositoryMock()
    const mockAuthenticationTokenManager = getAuthenticationTokenManagerMock()

    // Mocking
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(async () => ({ username: 'dicoding', id: 'user-123' }))
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(async () => 'some_new_access_token')

    // Create the use case instace
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      mockAuthenticationRepository,
      mockAuthenticationTokenManager
    )

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.decodePayload)
      .toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123' })
    expect(accessToken).toEqual('some_new_access_token')
  })
})
