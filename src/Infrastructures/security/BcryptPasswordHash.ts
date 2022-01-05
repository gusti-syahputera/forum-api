import PasswordHash from '../../Applications/security/PasswordHash'
import AuthenticationError from '../../Commons/exceptions/AuthenticationError'

export interface IBcrypt {
  hash: (string, number) => string
  compare: (plain, encrypted) => Promise<boolean>
}

export default class BcryptPasswordHash implements PasswordHash {
  constructor (
    private readonly bcrypt: IBcrypt,
    private readonly saltRound: number = 10
  ) {}

  async hash (password: string): Promise<string> {
    return this.bcrypt.hash(password, this.saltRound)
  }

  async comparePassword (password: string, hashedPassword: string): Promise<void> {
    const result = await this.bcrypt.compare(password, hashedPassword)

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah')
    }
  }
}
