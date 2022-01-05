export default class AddedThread {
  readonly id: string
  readonly title: string
  readonly owner: string

  constructor (payload) {
    ({
      id: this.id,
      title: this.title,
      owner: this.owner
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { id: string, title: string, owner: string } {
    const { id, title, owner } = payload

    if (!id || !title || !owner) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
