import AuthenticationsTableTestHelper from '../../../Commons/tests/AuthenticationsTableTestHelper'
import pool from '../../database/postgres/pool'
import AuthenticationRepositoryPostgres from '../AuthenticationRepositoryPostgres'

describe('AuthenticationRepository postgres', () => {
  afterEach(async () => await AuthenticationsTableTestHelper.cleanTable())
  afterAll(async () => await pool.end())

  describe('addToken function', () => {
    it('should add token to database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool)
      const token = 'token'

      // Action
      await authenticationRepository.addToken(token)

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token)
      expect(tokens).toHaveLength(1)
      expect(tokens[0].token).toBe(token)
    })
  })

  describe('checkAvailabilityToken function', () => {
    it('should reject if token not available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool)
      const token = 'token'

      // Action & Assert
      await expect(authenticationRepository.checkAvailabilityToken(token))
        .rejects.toThrow('REFRESH_TOKEN.NOT_FOUND')
    })

    it('should not reject if token available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool)
      const token = 'token'
      await AuthenticationsTableTestHelper.addToken(token)

      // Action & Assert
      await expect(authenticationRepository.checkAvailabilityToken(token))
        .resolves.not.toThrow()
    })
  })

  describe('deleteToken', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool)
      const token = 'token'
      await AuthenticationsTableTestHelper.addToken(token)

      // Action
      await authenticationRepository.deleteToken(token)

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token)
      expect(tokens).toHaveLength(0)
    })
  })
})
