import { createMock } from 'ts-auto-mock'
import { ThreadsTableTestHelper, UsersTableTestHelper } from '../../../Commons/tests'

import pool from '../../database/postgres/pool'
import { NewThread, AddedThread, Thread } from '../../../Domains/threads/entities'
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres'
import * as faker from 'faker'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const generateUserData = () => ({
  id: `user-${faker.datatype.uuid()}`,
  username: faker.internet.userName(),
  password: faker.internet.password(),
  fullname: faker.name.findName()
})

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => await Promise.all([
    ThreadsTableTestHelper.cleanTable(),
    UsersTableTestHelper.cleanTable()
  ]))

  afterAll(async () => await pool.end())

  describe('addThread function', () => {
    it('should create new thread and return added thread correctly', async () => {
      // Arrange entities
      const userData = generateUserData()
      await UsersTableTestHelper.addUser(userData)

      // Arrange doubles
      const fakeId = faker.datatype.uuid()
      const generateIdStub = (): string => fakeId
      const getCurrentTimeMock = createMock<() => string>()

      // Arrange inputs
      const newThread = new NewThread({
        title: faker.lorem.words(5),
        body: faker.lorem.paragraphs(),
        owner: userData.id
      })

      // Action
      const repository = new ThreadRepositoryPostgres(pool, generateIdStub, getCurrentTimeMock)
      const addedThread = await repository.addThread(newThread)

      // Assert
      const expectedAddedThread = new AddedThread({
        id: `thread-${fakeId}`,
        title: newThread.title,
        owner: userData.id
      })
      const thread = await ThreadsTableTestHelper.findThreadById(addedThread.id)
      expect(thread).toBeDefined()
      expect(addedThread).toStrictEqual(expectedAddedThread)
    })
  })

  describe('getThreadById function', () => {
    it('should reject when Thread does not exist', async () => {
      // Arrange doubles
      const fakeId = faker.datatype.uuid()
      const generateIdStub = (): string => fakeId
      const getCurrentTimeMock = createMock<() => string>()

      // Action
      const repository = new ThreadRepositoryPostgres(pool, generateIdStub, getCurrentTimeMock)
      const promise = repository.getThreadById(`thread-${fakeId}`)

      // Assert
      await expect(promise).rejects.toThrowError('THREAD.NOT_FOUND')
    })

    it('should return thread when thread is found', async () => {
      // Arrange mocks
      const fakeId = faker.datatype.uuid()
      const generateIdStub = (): string => fakeId
      const getCurrentTimeStub = (): string => new Date().toISOString()

      // Arrange User
      const userData = generateUserData()
      await UsersTableTestHelper.addUser(userData)

      // Arrange Thread
      const newThread = {
        id: `thread-${fakeId}`,
        title: faker.lorem.words(5),
        body: faker.lorem.paragraphs(),
        owner: userData.id,
        date: getCurrentTimeStub()
      }
      await ThreadsTableTestHelper.addThread(newThread)

      // Action
      const repository = new ThreadRepositoryPostgres(pool, generateIdStub, getCurrentTimeStub)
      const thread = await repository.getThreadById(newThread.id)

      // Assert
      const expectedThread = new Thread({
        id: newThread.id,
        title: newThread.title,
        body: newThread.body,
        date: newThread.date,
        username: userData.username
      })
      expect(thread).toStrictEqual(expectedThread)
    })
  })
})
