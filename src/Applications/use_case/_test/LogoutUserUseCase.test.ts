import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import LogoutUserUseCase from '../LogoutUserUseCase'

const getAuthenticationRepositoryMock = (): AuthenticationRepository => ({
  addToken: jest.fn().mockImplementation(async () => await Promise.resolve()),
  checkAvailabilityToken: jest.fn().mockImplementation(async () => await Promise.resolve()),
  deleteToken: jest.fn().mockImplementation(async () => await Promise.resolve())
})

describe('LogoutUserUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}
    const logoutUserUseCase = new LogoutUserUseCase(getAuthenticationRepositoryMock())

    // Action & Assert
    await expect(logoutUserUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123
    }
    const logoutUserUseCase = new LogoutUserUseCase(getAuthenticationRepositoryMock())

    // Action & Assert
    await expect(logoutUserUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken'
    }

    const mockAuthenticationRepository = getAuthenticationRepositoryMock()
    const logoutUserUseCase = new LogoutUserUseCase(mockAuthenticationRepository)

    // Act
    await logoutUserUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken)
  })
})
