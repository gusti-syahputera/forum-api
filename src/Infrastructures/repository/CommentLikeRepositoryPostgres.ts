import { Pool } from 'pg'

import CommentLikeRepository from '../../Domains/comment-likes/CommentLikeRepository'
import { CommentLike } from '../../Domains/comment-likes/entities'

export default class CommentLikeRepositoryPostgres implements CommentLikeRepository {
  constructor (private readonly pool: Pool) {}

  async addLike ({ comment_id, user_id }: CommentLike): Promise<void> {
    try {
      await this.pool.query({
        text: 'INSERT INTO likes (comment_id, user_id) VALUES ($1, $2)',
        values: [comment_id, user_id]
      })
    } catch (e) {
      if (e.code === '23505' /* unique key constraint violation */) {
        e.message = 'ADD_LIKE.ALREADY_EXISTS'
      }
      throw e
    }
  }

  async deleteLike ({ comment_id, user_id }: CommentLike): Promise<void> {
    const result = await this.pool.query({
      text: 'DELETE FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [comment_id, user_id]
    })

    if (result.rowCount === 0) {
      throw new Error('DELETE_LIKE.NOT_FOUND')
    }
  }
}
