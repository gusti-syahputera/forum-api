/* istanbul ignore file */
import * as faker from 'faker'

import pool from '../../Infrastructures/database/postgres/pool'

export default {
  async addUser ({
    id = `user-${faker.datatype.uuid()}`,
    username = faker.internet.userName(),
    password = faker.internet.password(),
    fullname = faker.name.findName()
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname]
    }

    await pool.query(query)

    return { id, username, password, fullname }
  },

  async findUsersById (id: string) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM users')
  }
}
