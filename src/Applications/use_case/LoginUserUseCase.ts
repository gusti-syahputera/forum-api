import UserLogin from '../../Domains/users/entities/UserLogin'
import NewAuthentication from '../../Domains/authentications/entities/NewAuth'
import UserRepository from '../../Domains/users/UserRepository'
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository'
import AuthenticationTokenManager from '../security/AuthenticationTokenManager'
import PasswordHash from '../security/PasswordHash'

export default class LoginUserUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly authenticationTokenManager: AuthenticationTokenManager,
    private readonly passwordHash: PasswordHash
  ) {
  }

  async execute (useCasePayload): Promise<NewAuthentication> {
    const { username, password } = new UserLogin(useCasePayload)

    const encryptedPassword = await this.userRepository.getPasswordByUsername(username)

    await this.passwordHash.comparePassword(password, encryptedPassword)

    const id = await this.userRepository.getIdByUsername(username)

    const accessToken = await this.authenticationTokenManager.createAccessToken({ username, id })
    const refreshToken = await this.authenticationTokenManager.createRefreshToken({ username, id })

    const newAuthentication = new NewAuthentication({ accessToken, refreshToken })

    await this.authenticationRepository.addToken(newAuthentication.refreshToken)

    return newAuthentication
  }
}
