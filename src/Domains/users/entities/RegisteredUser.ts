export default class RegisteredUser {
  id: string
  username: string
  fullname: string

  constructor (payload) {
    ({
      id: this.id,
      username: this.username,
      fullname: this.fullname
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { id: string, username: string, fullname: string } {
    const { id, username, fullname } = payload

    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
