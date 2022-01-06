import { Pool } from 'pg'

import CommentRepository from '../../Domains/comments/CommentRepository'
import { AddedComment, NewComment } from '../../Domains/comments/entities'

export default class CommentRepositoryPostgres implements CommentRepository {
  constructor (
    private readonly pool: Pool,
    private readonly generateId: () => string,
    private readonly getCurrentTime: () => string
  ) {}

  addComment = async (newComment: NewComment): Promise<AddedComment> => {
    const id = `comment-${this.generateId()}`
    const { thread_id: threadId, owner, content } = newComment
    const date = this.getCurrentTime()

    const result = await this.pool.query({
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, owner, content, date]
    })

    return new AddedComment({ ...result.rows[0] })
  }
}
