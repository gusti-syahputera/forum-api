import * as faker from 'faker'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../Commons/tests/ThreadsTableTestHelper'
import CommentsTableTestHelper from '../../../Commons/tests/CommentsTableTestHelper'
import CommentLikesTableTestHelper from '../../../Commons/tests/CommentLikesTableTestHelper'
import AuthHelper from '../../../Commons/tests/AuthenticationTestHelper'
import container from '../../tsyringeContainer'
import createServer from '../createServer'

describe('/threads/{threadId}/comments/{commentId}/replies endpoints', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => await pool.end())

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should return 401 response when no auth is provided', async () => {
      // Arrange
      const server = await createServer(container)
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadData.id}/comments/${commentData.id}/likes`
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

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        auth: AuthHelper.getJwtAuthBypass(user.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(expect.stringMatching(/tidak dapat mengubah like karena (thread|comment) tidak ada/))
    })

    it('should return 200 response', async () => {
      // Arrange
      const server = await createServer(container)
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadData.id}/comments/${commentData.id}/likes`,
        auth: AuthHelper.getJwtAuthBypass(userData.id)
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
