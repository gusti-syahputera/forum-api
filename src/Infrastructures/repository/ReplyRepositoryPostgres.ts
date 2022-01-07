import { Pool } from 'pg'

import ReplyRepository from '../../Domains/replies/ReplyRepository'
import { AddedReply, CommentReply, NewReply, Reply } from '../../Domains/replies/entities'

export default class ReplyRepositoryPostgres implements ReplyRepository {
  constructor (
    private readonly pool: Pool,
    private readonly generateId: () => string,
    private readonly getCurrentTime: () => string
  ) {}

  async addReply (newReply: NewReply): Promise<AddedReply> {
    const id = `reply-${this.generateId()}`
    const { comment_id: commentId, owner, content } = newReply
    const date = this.getCurrentTime()

    const result = await this.pool.query({
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, owner, content, date]
    })

    return new AddedReply(Object.assign(result.rows[0]))
  }

  async deleteReplyById (id: string): Promise<void> {
    const date = this.getCurrentTime()

    const result = await this.pool.query({
      text: 'UPDATE replies SET deleted_at=$1 WHERE id=$2 RETURNING id',
      values: [date, id]
    })

    if (result.rowCount === 0) {
      throw new Error('DELETE_REPLY.REPLY_NOT_FOUND')
    }
  }

  async getReplyById (id: string): Promise<Reply> {
    const result = await this.pool.query({
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    })

    if (result.rowCount === 0) {
      throw new Error('REPLY.NOT_FOUND')
    }

    return new Reply(Object.assign(result.rows[0]))
  }

  async getRepliesByThreadId (threadId: string): Promise<CommentReply[]> {
    const result = await this.pool.query({
      text: `
          SELECT replies.id,
                 comments.id AS comment_id,
                 users.username,
                 replies.date,
                 replies.content,
                 replies.deleted_at
          FROM replies
                   INNER JOIN comments ON replies.comment_id = comments.id
                   INNER JOIN users ON replies.owner = users.id
          WHERE comments.thread_id = $1
          ORDER BY replies.date`,
      values: [threadId]
    })
    return result.rows.map(row => new CommentReply(row))
  }
}
