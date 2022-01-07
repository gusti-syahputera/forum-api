export default class ThreadComment<Reply = any> {
  id: string;
  username: string;
  date: string;
  content: string;
  deleted_at?: string | null;
  replies?: Reply[]

  constructor (payload) {
    ({
      id: this.id,
      username: this.username,
      content: this.content,
      date: this.date,
      deleted_at: this.deleted_at,
      replies: this.replies
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): {
    id: string
    username: string
    content: string
    date: string
    deleted_at?: string | null
    replies?: Reply[]
  } {
    const { id, username, content, date, replies } = payload
    const { deleted_at: deletedAt } = payload

    if (!id || !username || !content || !date) {
      throw new Error('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      (deletedAt !== null && typeof deletedAt !== 'string') ||
      (replies !== undefined && !(Array.isArray(replies)))
    ) {
      throw new Error('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
