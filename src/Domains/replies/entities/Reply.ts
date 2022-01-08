export default class Reply {
  readonly id: string;
  readonly comment_id: string;
  readonly owner: string;
  readonly content: string;
  readonly date: string;
  readonly deleted_at: string;

  constructor (payload) {
    ({
      id: this.id,
      comment_id: this.comment_id,
      owner: this.owner,
      content: this.content,
      date: this.date,
      deleted_at: this.deleted_at
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): {
    id: string
    comment_id: string
    owner: string
    content: string
    date: string
    deleted_at: string
  } {
    const { id, comment_id, owner, content, date, deleted_at } = payload

    if (!id || !comment_id || !owner || !content || !date) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' ||
      typeof comment_id !== 'string' ||
      typeof owner !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      (deleted_at !== null && typeof deleted_at !== 'string')) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
