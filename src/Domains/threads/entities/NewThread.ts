export default class NewThread {
  readonly title: string
  readonly body: string
  readonly owner: string

  constructor (payload) {
    ({
      title: this.title,
      body: this.body,
      owner: this.owner
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { title: string, body: string, owner: string } {
    const { title, body, owner } = payload

    if (!title || !body || !owner) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
