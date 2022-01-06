/* istanbul ignore file */
import * as faker from 'faker'

import pool from '../../Infrastructures/database/postgres/pool'

export default {
  async addComment ({
    id = `comment-${faker.datatype.uuid()}`,
    thread_id = `thread-${faker.datatype.uuid()}`,
    owner = `user-${faker.datatype.uuid()}`,
    content = faker.lorem.paragraphs(),
    date = faker.datatype.datetime().toISOString(),
    deleted_at = faker.datatype.datetime().toISOString()
  }) {
    await pool.query({
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, thread_id, owner, content, date, deleted_at]
    })

    return { id, thread_id, owner, content, date, deleted_at }
  },

  async findCommentById (id: string) {
    const result = await pool.query({
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    })
    return result.rows[0]
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments')
  }
}
