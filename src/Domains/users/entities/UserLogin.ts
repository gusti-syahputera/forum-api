export default class UserLogin {
  username: string;
  password: string;

  constructor (payload) {
    UserLogin.verifyPayload(payload)

    this.username = payload.username
    this.password = payload.password
  }

  private static verifyPayload ({ username, password }): void {
    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
