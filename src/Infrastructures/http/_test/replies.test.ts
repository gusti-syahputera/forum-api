import * as faker from 'faker'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../Commons/tests/ThreadsTableTestHelper'
import CommentsTableTestHelper from '../../../Commons/tests/CommentsTableTestHelper'
import ReplyTableTestHelper from '../../../Commons/tests/ReplyTableTestHelper'
import AuthenticationsTableTestHelper from '../../../Commons/tests/AuthenticationsTableTestHelper'
import AuthHelper from '../../../Commons/tests/AuthenticationTestHelper'
import container from '../../tsyringeContainer'
import createServer from '../createServer'

describe('/threads/{threadId}/comments/{commentId}/replies endpoints', () => {
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await Promise.all([
      AuthenticationsTableTestHelper.cleanTable(),
      UsersTableTestHelper.cleanTable()
    ])
  })

  afterAll(async () => await pool.end())

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should return 401 response when no auth is provided', async () => {
      // Arrange
      const server = await createServer(container)
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })
      const requestPayload = {
        content: faker.lorem.paragraphs()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadData.id}/comments/${commentData.id}/replies`,
        payload: requestPayload
      })

      // Assert
      expect(response.statusCode).toEqual(401)
    })

    it('should return 404 response when Thread or Comment does not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const threadId = faker.datatype.uuid()
      const commentId = faker.datatype.uuid()
      const requestPayload = {
        content: faker.datatype.array()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(expect.stringMatching(/tidak dapat membuat reply baru karena (thread|comment) tidak ada/))
    })

    it('should return 201 response and persists Reply', async () => {
      // Arrange
      const server = await createServer(container)
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })
      const requestPayload = {
        content: faker.lorem.paragraphs()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadData.id}/comments/${commentData.id}/replies`,
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(userData.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
      expect(responseJson.data.addedReply).toBeDefined()
      expect(responseJson.data.addedReply.id).toBeDefined()
      expect(responseJson.data.addedReply.content).toBeDefined()
      expect(responseJson.data.addedReply.owner).toBeDefined()
    })

    it('should return 400 response when payload does not meet structure specifications', async () => {
      // Arrange
      const server = await createServer(container)
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })
      const requestPayload = {
        content: undefined
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadData.id}/comments/${commentData.id}/replies`,
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(userData.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada')
    })

    it('should return 400 response when payload does not meet data type specifications', async () => {
      // Arrange
      const server = await createServer(container)
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })
      const requestPayload = {
        content: faker.datatype.array()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadData.id}/comments/${commentData.id}/replies`,
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(userData.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat reply baru karena tipe data tidak sesuai')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/reply/{replyId}', () => {
    it('should return 401 response when no auth is provided', async () => {
      // Arrange
      const server = await createServer(container)
      const threadId = faker.datatype.uuid()
      const commentId = faker.datatype.uuid()
      const replyId = faker.datatype.uuid()

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`
      })

      // Assert
      expect(response.statusCode).toEqual(401)
    })

    it("should return 403 response when user is not Reply's owner", async () => {
      // Arrange
      const server = await createServer(container)
      const [userData1, userData2] = await Promise.all([
        UsersTableTestHelper.addUser({}),
        UsersTableTestHelper.addUser({})
      ])
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData1.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData1.id })
      const replyData = await ReplyTableTestHelper.addReply({ owner: userData1.id, comment_id: commentData.id })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadData.id}/comments/${commentData.id}/replies/${replyData.id}`,
        auth: AuthHelper.getJwtAuthBypass(userData2.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat menghapus reply karena Anda bukan pemilik reply ini')
    })

    it('should return 404 response when Thread or Comment does not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const user = await UsersTableTestHelper.addUser({})
      const threadId = faker.datatype.uuid()
      const commentId = faker.datatype.uuid()
      const replyId = faker.datatype.uuid()
      const requestPayload = {
        content: faker.lorem.paragraphs()
      }

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        payload: requestPayload,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(expect.stringMatching(/tidak dapat menghapus reply karena (thread|comment) tidak ada/))
    })

    it('should return 404 response when Reply does not exist', async () => {
      // Arrange
      const server = await createServer(container)
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })
      const replyId = faker.datatype.uuid()

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadData.id}/comments/${commentData.id}/replies/${replyId}`,
        auth: AuthHelper.getJwtAuthBypass(userData.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat menghapus reply karena reply tidak ada')
    })

    it('should return 200 response and success status', async () => {
      // Arrange
      const server = await createServer(container)
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })
      const replyData = await ReplyTableTestHelper.addReply({ owner: userData.id, comment_id: commentData.id })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadData.id}/comments/${commentData.id}/replies/${replyData.id}`,
        auth: AuthHelper.getJwtAuthBypass(userData.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
