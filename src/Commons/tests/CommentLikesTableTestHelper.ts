/* istanbul ignore file */
import * as faker from 'faker'

import pool from '../../Infrastructures/database/postgres/pool'

export default {
  async addLike ({
    comment_id = `comment-${faker.datatype.uuid()}`,
    user_id = `user-${faker.datatype.uuid()}`
  }) {
    await pool.query({
      text: 'INSERT INTO likes VALUES($1, $2)',
      values: [comment_id, user_id]
    })

    return { comment_id, user_id }
  },

  async findLike (commentId: string, userId: string) {
    const result = await pool.query({
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId]
    })
    return result.rows[0]
  },

  async cleanTable () {
    await pool.query('DELETE FROM likes')
  }
}
