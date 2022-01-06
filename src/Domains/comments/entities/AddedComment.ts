export default class AddedComment {
  readonly id: string;
  readonly content: string;
  readonly owner: string;

  constructor (payload) {
    ({
      id: this.id,
      content: this.content,
      owner: this.owner
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { id: string, content: string, owner: string } {
    const { id, content, owner } = payload

    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
