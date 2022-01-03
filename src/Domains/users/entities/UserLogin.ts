export default class UserLogin {
  username: string
  password: string

  constructor (payload) {
    ({ username: this.username, password: this.password } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { username: string, password: string } {
    const { username, password } = payload

    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
