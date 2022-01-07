/* istanbul ignore file */
import * as faker from 'faker'

import pool from '../../Infrastructures/database/postgres/pool'

export default {
  async addReply ({
    /* eslint-disable @typescript-eslint/naming-convention */
    id = `reply-${faker.datatype.uuid()}`,
    comment_id = `comment-${faker.datatype.uuid()}`,
    owner = `user-${faker.datatype.uuid()}`,
    content = faker.lorem.paragraphs(),
    date = faker.datatype.datetime().toISOString(),
    deleted_at = faker.datatype.datetime().toISOString()
    /* eslint-enable @typescript-eslint/naming-convention */
  }) {
    await pool.query({
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, comment_id, owner, content, date, deleted_at]
    })

    return { id, comment_id, owner, content, date, deleted_at }
  },

  async findReplyById (id: string) {
    const result = await pool.query({
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    })
    return result.rows[0]
  },

  async cleanTable () {
    await pool.query('DELETE FROM replies')
  }
}
