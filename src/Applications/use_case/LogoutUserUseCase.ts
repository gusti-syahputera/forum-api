import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository'

export default class LogoutUserUseCase {
  constructor (
    private readonly authenticationRepository: AuthenticationRepository
  ) {}

  async execute (useCasePayload): Promise<void> {
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
