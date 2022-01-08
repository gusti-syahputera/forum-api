import UserRepository from '../../Domains/users/UserRepository'
import PasswordHash from '../security/PasswordHash'
import { RegisterUser, RegisteredUser } from '../../Domains/users/entities'

export default class AddUserUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly passwordHash: PasswordHash
  ) {}

  async execute (useCasePayload): Promise<RegisteredUser> {
    const registerUser = new RegisterUser(useCasePayload)
    await this.userRepository.verifyAvailableUsername(registerUser.username)
    registerUser.password = await this.passwordHash.hash(registerUser.password)
    return await this.userRepository.addUser(registerUser)
  }
}
