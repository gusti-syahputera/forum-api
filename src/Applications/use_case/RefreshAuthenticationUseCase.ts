import 'reflect-metadata'

import { inject, injectable } from 'tsyringe'
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository'
import AuthenticationTokenManager from '../security/AuthenticationTokenManager'

@injectable()
export default class RefreshAuthenticationUseCase {
  private readonly authenticationRepository: AuthenticationRepository;
  private readonly authenticationTokenManager: AuthenticationTokenManager;

  constructor (
  @inject('authenticationRepository') authenticationRepository: AuthenticationRepository,
    @inject('authenticationTokenManager') authenticationTokenManager: AuthenticationTokenManager
  ) {
    this.authenticationRepository = authenticationRepository
    this.authenticationTokenManager = authenticationTokenManager
  }

  async execute (useCasePayload): Promise<string> {
    const { refreshToken } = this.verifyPayload(useCasePayload)

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken)
    await this.authenticationRepository.checkAvailabilityToken(refreshToken)

    const { username, id } = await this.authenticationTokenManager.decodePayload(refreshToken)

    return await this.authenticationTokenManager.createAccessToken({ username, id })
  }

  private verifyPayload (payload): { refreshToken: string } {
    const { refreshToken } = payload

    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
