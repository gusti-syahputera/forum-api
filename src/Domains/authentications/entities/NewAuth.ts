export default class NewAuth {
  accessToken: string
  refreshToken: string

  constructor (payload) {
    ({ accessToken: this.accessToken, refreshToken: this.refreshToken } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { accessToken: string, refreshToken: string} {
    const { accessToken, refreshToken } = payload

    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
