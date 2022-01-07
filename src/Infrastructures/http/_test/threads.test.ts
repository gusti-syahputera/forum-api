import * as faker from 'faker'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../Commons/tests/ThreadsTableTestHelper'
import AuthenticationsTableTestHelper from '../../../Commons/tests/AuthenticationsTableTestHelper'
import CommentsTableTestHelper from '../../../Commons/tests/CommentsTableTestHelper'
import AuthHelper from '../../../Commons/tests/AuthenticationTestHelper'
import container from '../../tsyringeContainer'
import createServer from '../createServer'

describe('/threads endpoints', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await Promise.all([
      AuthenticationsTableTestHelper.cleanTable(),
      UsersTableTestHelper.cleanTable()
    ])
  })

  afterAll(async () => await pool.end())

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const requestPayload = {
        title: faker.lorem.words(),
        body: faker.lorem.paragraphs()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
      expect(responseJson.data.addedThread).toBeDefined()
      expect(responseJson.data.addedThread.id).toBeDefined()
      expect(responseJson.data.addedThread.title).toBeDefined()
      expect(responseJson.data.addedThread.owner).toBeDefined()
    })

    it('should respond with 403 when no access token is provided', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        title: faker.lorem.words(),
        body: faker.lorem.paragraphs()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload
      })

      // Assert
      expect(response.statusCode).toEqual(401)
    })

    it('should response with 400 when payload does not meet structure specifications', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const requestPayload = {
        title: faker.lorem.words(),
        body: undefined
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response with 400 when payload does not meet data type specifications', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const requestPayload = {
        title: faker.datatype.array(),
        body: faker.datatype.array()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should return 404 response when the thread does not exist', async () => {
      // Arrange
      const randomId = 'thread-faker.datatype.uuid()'

      // Action
      const server = await createServer(container)
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${randomId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ada')
    })

    it('should return 200 response', async () => {
      // Arrange User & Thread
      const usersData = await Promise.all([...Array(10).keys()].map(
        async () => await UsersTableTestHelper.addUser({})
      ))
      const thread = await ThreadsTableTestHelper.addThread({
        owner: faker.random.arrayElement(usersData).id
      })

      // Arrange Comments
      const commentCounts = 50
      await Promise.all([...Array(commentCounts).keys()].map(
        async () => await CommentsTableTestHelper.addComment({
          thread_id: thread.id,
          owner: faker.random.arrayElement(usersData).id
        })
      ))

      // Action
      const server = await createServer(container)
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${thread.id}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
      expect(responseJson.data.thread).toBeDefined()
      expect(responseJson.data.thread.id).toBeDefined()
      expect(responseJson.data.thread.title).toBeDefined()
      expect(responseJson.data.thread.body).toBeDefined()
      expect(responseJson.data.thread.date).toBeDefined()
      expect(responseJson.data.thread.username).toBeDefined()
      expect(responseJson.data.thread.comments).toBeDefined()
      expect(responseJson.data.thread.comments).toHaveLength(commentCounts)
    })
  })
})
