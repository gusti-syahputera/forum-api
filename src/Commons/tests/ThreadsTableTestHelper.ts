/* istanbul ignore file */
import * as faker from 'faker'

import pool from '../../Infrastructures/database/postgres/pool'

export default {
  async addThread ({
    id = `thread-${faker.datatype.uuid()}`,
    title = faker.lorem.words(),
    body = faker.lorem.paragraphs(),
    owner = `user-${faker.datatype.uuid()}`,
    date = faker.datatype.datetime().toISOString()
  }) {
    await pool.query({
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date]
    })

    return { id, title, body, owner, date }
  },

  async findThreadById (id: string) {
    const result = await pool.query({
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    })
    return result.rows[0]
  },

  async cleanTable () {
    await pool.query('DELETE FROM threads')
  }
}
