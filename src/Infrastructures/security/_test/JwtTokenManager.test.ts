import * as Jwt from '@hapi/jwt'

import JwtTokenManager, { IJwtHelper } from '../JwtTokenManager'

const getJwtHelperMock = (): IJwtHelper => ({
  generate: jest.fn().mockImplementation(async () => 'mock_token'),
  decode: jest.fn().mockImplementation(async () => ({})),
  verify: jest.fn().mockImplementation(async () => await Promise.resolve())
})

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding'
      }
      const mockJwtToken = getJwtHelperMock()
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload)

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY)
      expect(accessToken).toEqual('mock_token')
    })
  })

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding'
      }
      const mockJwtToken = getJwtHelperMock()
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload)

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY)
      expect(refreshToken).toEqual('mock_token')
    })
  })

  describe('verifyRefreshToken function', () => {
    it('should reject when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' })

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects.toThrow('AUTHENTICATION.INVALID_REFRESH_TOKEN')
    })

    it('should not reject when refresh token is verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' })

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow()
    })
  })

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' })

      // Action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken)

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding')
    })
  })
})
