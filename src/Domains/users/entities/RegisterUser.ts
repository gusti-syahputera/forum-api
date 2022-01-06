export default class RegisterUser {
  username: string
  password: string
  fullname: string

  constructor (payload) {
    ({
      username: this.username,
      password: this.password,
      fullname: this.fullname
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { username: string, password: string, fullname: string } {
    const { username, password, fullname } = payload

    if (!username || !password || !fullname) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')
    }

    if (username.match(/^[\w.]+$/) == null) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
    }

    return payload
  }
}
