import * as faker from 'faker'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../Commons/tests/ThreadsTableTestHelper'
import AuthenticationsTableTestHelper from '../../../Commons/tests/AuthenticationsTableTestHelper'
import AuthHelper from '../../../Commons/tests/AuthenticationTestHelper'
import container from '../../tsyringeContainer'
import createServer from '../createServer'

describe('/threads endpoints', () => {
  afterEach(async () => await Promise.all([
    UsersTableTestHelper.cleanTable(),
    AuthenticationsTableTestHelper.cleanTable(),
    ThreadsTableTestHelper.cleanTable()
  ]))

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
})
