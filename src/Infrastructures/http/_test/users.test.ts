import * as faker from 'faker'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import container from '../../tsyringeContainer'
import createServer from '../createServer'

describe('/users endpoint', () => {
  afterEach(async () => await UsersTableTestHelper.cleanTable())
  afterAll(async () => await pool.end())

  describe('when POST /users', () => {
    it('should return 201 response and persists User', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        fullname: faker.name.findName()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedUser).toBeDefined()
    })

    it('should return 400 response when request payload does not contain needed property', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        username: undefined,
        password: faker.internet.password(),
        fullname: faker.name.findName()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada')
    })

    it('should retun 400 response when request payload does not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        fullname: faker.datatype.array()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai')
    })

    it('should return 400 response when username has more than 50 character', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        username: faker.lorem.paragraph(),
        password: faker.internet.password(),
        fullname: faker.name.findName()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit')
    })

    it('should return 400 response when username contains restricted character', async () => {
      // Arrange
      const server = await createServer(container)
      const requestPayload = {
        username: 'doni (spasi) 39',
        password: faker.internet.password(),
        fullname: faker.name.findName()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang')
    })

    it('should return 400 response when username is already taken', async () => {
      // Arrange
      const [server, existedUserData] = await Promise.all([
        createServer(container),
        UsersTableTestHelper.addUser({})
      ])
      const requestPayload = {
        username: existedUserData.username,
        password: faker.internet.password(),
        fullname: faker.name.findName()
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username tidak tersedia')
    })
  })
})
