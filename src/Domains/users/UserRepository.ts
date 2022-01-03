import RegisterUser from './entities/RegisterUser'
import RegisteredUser from './entities/RegisteredUser'

export default interface UserRepository {
  addUser: (registerUser: RegisterUser) => Promise<RegisteredUser>
  verifyAvailableUsername: (username: string) => Promise<void>
  getPasswordByUsername: (username: string) => Promise<string>
  getIdByUsername: (username: string) => Promise<string>
}
