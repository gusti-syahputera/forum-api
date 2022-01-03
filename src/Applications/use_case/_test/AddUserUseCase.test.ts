import RegisterUser from '../../../Domains/users/entities/RegisterUser'
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser'
import UserRepository from '../../../Domains/users/UserRepository'
import PasswordHash from '../../security/PasswordHash'
import AddUserUseCase from '../AddUserUseCase'

describe('AddUserUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }
    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    })

    /** creating mocked dependency of use case */
    const mockUserRepository: UserRepository = {
      verifyAvailableUsername: jest.fn().mockImplementation(async () => await Promise.resolve()),
      addUser: jest.fn().mockImplementation(async () => expectedRegisteredUser),
      getPasswordByUsername: jest.fn().mockImplementation(() => {}),
      getIdByUsername: jest.fn().mockImplementation(() => {})
    }
    const mockPasswordHash: PasswordHash = {
      hash: jest.fn().mockImplementation(async () => 'encrypted_password'),
      comparePassword: jest.fn().mockImplementation(() => true)
    }

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase(mockUserRepository, mockPasswordHash)

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload)

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser)
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username)
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname
    }))
  })
})
