export default class RegisteredUser {
  id: string
  username: string
  fullname: string

  constructor (payload) {
    RegisteredUser.verifyPayload(payload)

    const { id, username, fullname } = payload

    this.id = id
    this.username = username
    this.fullname = fullname
  }

  private static verifyPayload ({ id, username, fullname }): void {
    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
