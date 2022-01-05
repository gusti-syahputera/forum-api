import { Pool } from 'pg'

import { NotFoundError } from '../../Commons/exceptions'
import ThreadRepository from '../../Domains/threads/ThreadRepository'
import { NewThread, AddedThread, Thread } from '../../Domains/threads/entities'

export default class ThreadRepositoryPostgres implements ThreadRepository {
  constructor (
    private readonly pool: Pool,
    private readonly generateId: () => string,
    private readonly getCurrentTime: () => string
  ) {}

  addThread = async (newThread: NewThread): Promise<AddedThread> => {
    const id = `thread-${this.generateId()}`
    const { title, body, owner } = newThread
    const date = this.getCurrentTime()

    const result = await this.pool.query({
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date]
    })

    return new AddedThread({ ...result.rows[0] })
  };

  getThreadById = async (id: string): Promise<Thread> => {
    const result = await this.pool.query({
      text: `
          SELECT threads.id, threads.title, threads.body, threads.date, users.username
          FROM threads
                   INNER JOIN users ON threads.owner = users.id
          WHERE threads.id = $1`,
      values: [id]
    })

    if (result.rowCount === 0) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    return new Thread({ ...result.rows[0] })
  }
}
