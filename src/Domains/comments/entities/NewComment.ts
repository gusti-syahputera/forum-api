export default class NewComment {
  readonly thread_id: string
  readonly owner: string
  readonly content: string

  constructor (payload) {
    ({
      thread_id: this.thread_id,
      owner: this.owner,
      content: this.content
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { thread_id: string, owner: string, content: string } {
    const { thread_id, owner, content } = payload

    if (!thread_id || !owner || !content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof thread_id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
