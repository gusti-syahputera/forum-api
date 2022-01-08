export default class NewReply {
  readonly comment_id: string
  readonly owner: string
  readonly content: string

  constructor (payload) {
    ({
      comment_id: this.comment_id,
      owner: this.owner,
      content: this.content
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { comment_id: string, owner: string, content: string } {
    const { comment_id, owner, content } = payload

    if (!comment_id || !owner || !content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof comment_id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
