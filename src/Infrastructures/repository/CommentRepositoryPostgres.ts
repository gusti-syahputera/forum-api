import { Pool } from 'pg'

import { NotFoundError } from '../../Commons/exceptions'
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

  deleteCommentById = async (id: string): Promise<void> => {
    const date = this.getCurrentTime()

    const result = await this.pool.query({
      text: 'UPDATE comments SET deleted_at=$1 WHERE id=$2 RETURNING id',
      values: [date, id]
    })

    if (result.rowCount === 0) {
      throw new NotFoundError('DELETE_COMMENT.NOT_FOUND')
    }
  }
}
