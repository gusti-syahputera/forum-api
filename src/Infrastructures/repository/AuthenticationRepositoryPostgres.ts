import { Pool } from 'pg'

import InvariantError from '../../Commons/exceptions/InvariantError'
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository'

export default class AuthenticationRepositoryPostgres implements AuthenticationRepository {
  constructor (private readonly pool: Pool) {}

  async addToken (token): Promise<any> {
    await this.pool.query({
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token]
    })
  }

  async checkAvailabilityToken (token): Promise<void> {
    const result = await this.pool.query({
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token]
    })

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database')
    }
  }

  async deleteToken (token): Promise<any> {
    await this.pool.query({
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token]
    })
  }
}
