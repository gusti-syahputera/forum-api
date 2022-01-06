export default class Comment {
  readonly id: string;
  readonly thread_id: string;
  readonly owner: string;
  readonly content: string;
  readonly date: string;
  readonly deleted_at: string;

  constructor (payload) {
    ({
      id: this.id,
      thread_id: this.thread_id,
      owner: this.owner,
      content: this.content,
      date: this.date,
      deleted_at: this.deleted_at
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): {
    id: string
    thread_id: string
    owner: string
    content: string
    date: string
    deleted_at: string
  } {
    const { id, thread_id, owner, content, date, deleted_at } = payload

    if (!id || !thread_id || !owner || !content || !date) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof thread_id !== 'string' || typeof owner !== 'string' ||
      typeof content !== 'string' || typeof date !== 'string' ||
      (deleted_at !== null && typeof deleted_at !== 'string')) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
