/* istanbul ignore file */
import pool from '../../Infrastructures/database/postgres/pool'

export default {
  async addThread ({
    id = 'thread-1',
    title = 'sebuah judul',
    body = 'isi teks thread',
    owner = 'user-1',
    date = '2022-01-01T00:00:00.000Z'
  }) {
    await pool.query({
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date]
    })
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
