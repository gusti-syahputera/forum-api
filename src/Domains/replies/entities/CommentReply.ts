export default class CommentReply {
  id: string;
  comment_id?: string;
  username: string;
  date: string;
  content: string;
  deleted_at?: string | null;

  constructor (payload) {
    ({
      id: this.id,
      comment_id: this.comment_id,
      username: this.username,
      content: this.content,
      date: this.date,
      deleted_at: this.deleted_at
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): {
    id: string
    comment_id?: string
    username: string
    content: string
    date: string
    deleted_at?: string | null
  } {
    const { id, username, content, date } = payload
    const { comment_id: commentId, deleted_at: deletedAt } = payload

    if (!id || !username || !content || !date) {
      throw new Error('COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      (commentId !== undefined && typeof commentId !== 'string') ||
      typeof username !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      (deletedAt !== null && typeof deletedAt !== 'string')
    ) {
      throw new Error('COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
