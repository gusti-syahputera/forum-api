import * as bcrypt from 'bcrypt'

import AuthenticationError from '../../../Commons/exceptions/AuthenticationError'
import BcryptEncryptionHelper from '../BcryptPasswordHash'

describe('BcryptEncryptionHelper', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash')
      const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt)

      // Action
      const encryptedPassword = await bcryptEncryptionHelper.hash('plain_password')

      // Assert
      expect(typeof encryptedPassword).toEqual('string')
      expect(encryptedPassword).not.toEqual('plain_password')
      expect(spyHash).toBeCalledWith('plain_password', 10) // 10 adalah nilai saltRound default untuk BcryptEncryptionHelper
    })
  })

  describe('comparePassword function', () => {
    it('should reject if password does not match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt)

      // Act & Assert
      await expect(bcryptEncryptionHelper
        .comparePassword('plain_password', 'encrypted_password'))
        .rejects.toThrow('AUTHENTICATION.INVALID_CREDENTIALS')
    })

    it('should not reject if password matches', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt)
      const plainPassword = 'secret'
      const encryptedPassword = await bcryptEncryptionHelper.hash(plainPassword)

      // Act & Assert
      await expect(bcryptEncryptionHelper.comparePassword(plainPassword, encryptedPassword))
        .resolves.not.toThrow()
    })
  })
})
