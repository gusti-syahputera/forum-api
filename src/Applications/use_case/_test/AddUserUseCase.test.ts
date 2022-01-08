import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'
import { method, On } from 'ts-auto-mock/extension'

import { RegisterUser, RegisteredUser } from '../../../Domains/users/entities'
import UserRepository from '../../../Domains/users/UserRepository'
import PasswordHash from '../../security/PasswordHash'
import AddUserUseCase from '../AddUserUseCase'

describe('AddUserUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange inputs
    const useCasePayload = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      fullname: faker.name.findName()
    }

    // Arrange doubles
    const registeredUser = new RegisteredUser({
      id: `user-${faker.datatype.uuid()}`,
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    })
    const userRepository = createMock<UserRepository>()
    const userRepositoryMocks = {
      verifyAvailableUsername: On(userRepository)
        .get(method('verifyAvailableUsername'))
        .mockImplementation(async () => await Promise.resolve()),
      addUser: On(userRepository)
        .get(method('addUser'))
        .mockResolvedValue(registeredUser)
    }
    const hashedPassword = faker.datatype.hexaDecimal(64)
    const passwordHash = createMock<PasswordHash>()
    const passwordHashMocks = {
      hash: On(passwordHash)
        .get(method(method => method.hash))
        .mockResolvedValue(hashedPassword)
    }

    // Action
    const getUserUseCase = new AddUserUseCase(userRepository, passwordHash)
    const promise = getUserUseCase.execute(useCasePayload)

    // Assert

    const expectedRegisteredUser = Object.assign({}, registeredUser)
    await expect(promise).resolves.toMatchObject(expectedRegisteredUser)
    expect(userRepositoryMocks.verifyAvailableUsername).toBeCalledWith(useCasePayload.username)
    expect(passwordHashMocks.hash).toBeCalledWith(useCasePayload.password)

    const expectedRegisterUser = new RegisterUser({
      username: useCasePayload.username,
      password: hashedPassword,
      fullname: useCasePayload.fullname
    })
    expect(userRepositoryMocks.addUser).toBeCalledWith(expectedRegisterUser)
  })
})
