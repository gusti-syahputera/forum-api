import { Pool } from 'pg'

import { RegisteredUser } from '../../Domains/users/entities'
import UserRepository from '../../Domains/users/UserRepository'

type GenerateIdFunc = () => string

export default class UserRepositoryPostgres implements UserRepository {
  constructor (
    private readonly pool: Pool,
    private readonly idGenerator: GenerateIdFunc
  ) {}

  async verifyAvailableUsername (username): Promise<void> {
    const result = await this.pool.query({
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    })

    if (result.rowCount !== 0) {
      throw new Error('USERNAME.ALREADY_TAKEN')
    }
  }

  async addUser (registerUser): Promise<RegisteredUser> {
    const { username, password, fullname } = registerUser
    const id = `user-${this.idGenerator()}`

    const result = await this.pool.query({
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname]
    })

    return new RegisteredUser({ ...result.rows[0] })
  }

  async getPasswordByUsername (username): Promise<string> {
    const result = await this.pool.query({
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username]
    })

    if (result.rowCount === 0) {
      throw new Error('USERNAME.NOT_FOUND')
    }

    return result.rows[0].password
  }

  async getIdByUsername (username): Promise<string> {
    const result = await this.pool.query({
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username]
    })

    if (result.rowCount === 0) {
      throw new Error('USER.NOT_FOUND')
    }

    return result.rows[0].id
  }
}
