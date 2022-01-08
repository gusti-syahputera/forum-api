import * as faker from 'faker'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import AuthenticationsTableTestHelper from '../../../Commons/tests/AuthenticationsTableTestHelper'
import container, { tokens as containerTokens } from '../../tsyringeContainer'
import createServer from '../createServer'
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager'

describe('/authentications endpoint', () => {
  afterAll(async () => await pool.end())
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when POST /authentications', () => {
    it('should return 201 response and the new authentication', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        username: faker.internet.userName(),
        password: faker.internet.password()
      }

      // Arrange User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { ...requestPayload, fullname: faker.name.findName() }
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
      expect(responseJson.data.refreshToken).toBeDefined()
    })

    it('should return 400 response if username is not found', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        username: faker.internet.userName(),
        password: faker.internet.password()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username tidak ditemukan')
    })

    it('should return 401 response if given password is wrong', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        username: faker.internet.userName(),
        password: faker.internet.password()
      }

      // Add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: requestPayload.username,
          password: faker.internet.password(),
          fullname: faker.name.findName()
        }
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('kredensial yang Anda masukkan salah')
    })

    it('should return 400 response if login payload does not contain needed property', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        username: 'dicoding',
        password: undefined
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('harus mengirimkan username dan password')
    })

    it('should return 400 response if login payload has wrong data types', async () => {
      // Arrange
      const requestPayload = {
        username: faker.datatype.number(),
        password: faker.datatype.array()
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username dan password harus string')
    })
  })

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      // Arrange
      const server = await createServer(container)
      const userData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        fullname: faker.name.findName()
      }

      // Arrange to create User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userData
      })

      // Arrange to login
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userData.username,
          password: userData.password
        }
      })
      const { data: { refreshToken } } = JSON.parse(loginResponse.payload)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
    })

    it('should return 400 response if payload does not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: undefined
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('harus mengirimkan token refresh')
    })

    it('should return 400 if refresh token not string', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: faker.datatype.number()
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token harus string')
    })

    it('should return 400 response if refresh token is not valid', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {
          refreshToken: faker.datatype.hexaDecimal(64)
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token tidak valid')
    })

    it('should return 400 response if refresh token is not registered in the database', async () => {
      // Arrange
      const username = faker.internet.userName()
      const tokenManager = container.resolve<AuthenticationTokenManager>(containerTokens.AuthenticationTokenManager)
      const [server, refreshToken] = await Promise.all([
        createServer(container),
        tokenManager.createRefreshToken({ username })
      ])

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database')
    })
  })

  describe('when DELETE /authentications', () => {
    it('should return 200 response if refresh token is valid', async () => {
      // Arrange
      const refreshToken = faker.datatype.uuid()
      const [server] = await Promise.all([
        createServer(container),
        AuthenticationsTableTestHelper.addToken(refreshToken)
      ])

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should return 400 response if refresh token is not registered in database', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: faker.datatype.uuid()
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token tidak ditemukan di database')
    })

    it('should return 400 response if payload does not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: undefined
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('harus mengirimkan token refresh')
    })

    it('should return 400 response if refresh token is not string', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: faker.datatype.number()
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token harus string')
    })
  })
})
