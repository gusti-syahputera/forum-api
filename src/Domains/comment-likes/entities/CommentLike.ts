export default class CommentLike {
  readonly comment_id: string
  readonly user_id: string

  constructor (payload) {
    ({
      comment_id: this.comment_id,
      user_id: this.user_id
    } = this.verifyPayload(payload))
  }

  private verifyPayload (payload): { comment_id: string, user_id: string } {
    const { comment_id, user_id } = payload

    if (!comment_id || !user_id) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof comment_id !== 'string' || typeof user_id !== 'string') {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    return payload
  }
}
