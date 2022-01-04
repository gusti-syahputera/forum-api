import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository'
import DeleteAuthenticationUseCase from '../DeleteAuthenticationUseCase'

const instantAsyncFunc = async (): Promise<any> => await Promise.resolve()

const getAuthenticationRepositoryMock = (): AuthenticationRepository => ({
  addToken: jest.fn().mockImplementation(instantAsyncFunc),
  checkAvailabilityToken: jest.fn().mockImplementation(instantAsyncFunc),
  deleteToken: jest.fn().mockImplementation(instantAsyncFunc)
})

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase(getAuthenticationRepositoryMock())

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123
    }
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase(getAuthenticationRepositoryMock())

    // Action & Assert
    await expect(deleteAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken'
    }
    const mockAuthenticationRepository = getAuthenticationRepositoryMock()
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase(mockAuthenticationRepository)

    // Act
    await deleteAuthenticationUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken)
  })
})
