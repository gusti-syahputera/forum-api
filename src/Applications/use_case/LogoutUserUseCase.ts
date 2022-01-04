import 'reflect-metadata'

import { inject, injectable } from 'tsyringe'

import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository'

@injectable()
export default class LogoutUserUseCase {
  private readonly authenticationRepository: AuthenticationRepository;

  constructor (
  @inject('authenticationRepository') authenticationRepository: AuthenticationRepository
  ) {
    this.authenticationRepository = authenticationRepository
  }

  public async execute (useCasePayload): Promise<void> {
    const { refreshToken } = this.validatePayload(useCasePayload)
    await this.authenticationRepository.checkAvailabilityToken(refreshToken)
    await this.authenticationRepository.deleteToken(refreshToken)
  }

  private validatePayload (payload): { refreshToken: string } {
    const { refreshToken } = payload

    if (!refreshToken) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
