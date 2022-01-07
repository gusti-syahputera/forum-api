import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import { RegisterUser, RegisteredUser } from '../../../Domains/users/entities'
import pool from '../../database/postgres/pool'
import UserRepositoryPostgres from '../UserRepositoryPostgres'

describe('UserRepositoryPostgres', () => {
  afterEach(async () => await UsersTableTestHelper.cleanTable())
  afterAll(async () => await pool.end())

  describe('verifyAvailableUsername function', () => {
    it('should reject when username is not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' }) // memasukan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '')

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding'))
        .rejects.toThrowError('USERNAME.ALREADY_TAKEN')
    })

    it('should not reject when username is available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '')

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding'))
        .resolves.not.toThrowError()
    })
  })

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = (): string => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await userRepositoryPostgres.addUser(registerUser)

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123')
      expect(users).toHaveLength(1)
    })

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = (): string => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser)

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia'
      }))
    })
  })

  describe('getPasswordByUsername', () => {
    it('should reject when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '')

      // Action & Assert
      return await expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
        .rejects.toThrowError('USERNAME.NOT_FOUND')
    })

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '')
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password'
      })

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('dicoding')
      expect(password).toBe('secret_password')
    })
  })

  describe('getIdByUsername', () => {
    it('should reject when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '')

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
        .rejects
        .toThrowError('USER.NOT_FOUND')
    })

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding' })
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '')

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('dicoding')

      // Assert
      expect(userId).toEqual('user-321')
    })
  })
})
