import * as faker from 'faker'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../Commons/tests/ThreadsTableTestHelper'
import CommentsTableTestHelper from '../../../Commons/tests/CommentsTableTestHelper'
import AuthenticationsTableTestHelper from '../../../Commons/tests/AuthenticationsTableTestHelper'
import AuthHelper from '../../../Commons/tests/AuthenticationTestHelper'
import container from '../../tsyringeContainer'
import createServer from '../createServer'

describe('/threads/{threadId}/comments endpoints', () => {
  afterEach(async () => await Promise.all([
    UsersTableTestHelper.cleanTable(),
    AuthenticationsTableTestHelper.cleanTable(),
    ThreadsTableTestHelper.cleanTable(),
    CommentsTableTestHelper.cleanTable()
  ]))

  afterAll(async () => await pool.end())

  describe('when POST /threads/{threadId}/comments', () => {
    it('should return 401 response when no auth is provided', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const thread = await ThreadsTableTestHelper.addThread({ owner: user.id })
      const requestPayload = {
        content: faker.lorem.paragraphs()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: requestPayload
      })

      // Assert
      expect(response.statusCode).toEqual(401)
    })

    it('should return 404 response when thread does not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const threadId = faker.datatype.uuid()
      const requestPayload = {
        content: faker.datatype.array()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena thread tidak ada')
    })

    it('should return 201 response and persists the comment', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const thread = await ThreadsTableTestHelper.addThread({ owner: user.id })
      const requestPayload = {
        content: faker.lorem.paragraphs()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
      expect(responseJson.data.addedComment).toBeDefined()
      expect(responseJson.data.addedComment.id).toBeDefined()
      expect(responseJson.data.addedComment.content).toBeDefined()
      expect(responseJson.data.addedComment.owner).toBeDefined()
    })

    it('should return 400 response when payload does not meet structure specifications', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const thread = await ThreadsTableTestHelper.addThread({ owner: user.id })
      const requestPayload = {
        content: undefined
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada')
    })

    it('should return 400 response when payload does not meet data type specifications', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const thread = await ThreadsTableTestHelper.addThread({ owner: user.id })
      const requestPayload = {
        content: faker.datatype.array()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commendId}', () => {
    it('should return 401 response when no auth is provided', async () => {
      // Arrange
      const server = await createServer(container)
      const threadId = faker.datatype.uuid()
      const commentId = faker.datatype.uuid()

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`
      })

      // Assert
      expect(response.statusCode).toEqual(401)
    })

    it("should return 403 response when user is not the comment's owner", async () => {
      // Arrange
      const server = await createServer(container)
      const [user1, user2] = await Promise.all([
        UsersTableTestHelper.addUser({}),
        UsersTableTestHelper.addUser({})
      ])
      const thread = await ThreadsTableTestHelper.addThread({ owner: user1.id })
      const comment = await CommentsTableTestHelper.addComment({ thread_id: thread.id, owner: user1.id })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}`,
        auth: AuthHelper.getJwtAuthBypass(user2.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat menghapus comment karena Anda bukan pemilik comment ini')
    })

    it('should return 404 response when thread does not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const threadId = faker.datatype.uuid()
      const commentId = faker.datatype.uuid()

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat menghapus comment karena thread tidak ada')
    })

    it('should return 404 response when comment does not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const thread = await ThreadsTableTestHelper.addThread({ owner: user.id })
      const commentId = faker.datatype.uuid()

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${commentId}`,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat menghapus comment karena comment tidak ada')
    })

    it('should return 200 response and success status', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const thread = await ThreadsTableTestHelper.addThread({ owner: user.id })
      const comment = await CommentsTableTestHelper.addComment({ thread_id: thread.id, owner: user.id })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}`,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
