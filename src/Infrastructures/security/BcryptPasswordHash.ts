import { inject, injectable } from 'tsyringe'

import PasswordHash from '../../Applications/security/PasswordHash'
import AuthenticationError from '../../Commons/exceptions/AuthenticationError'

export interface IBcrypt {
  hash: (string, number) => string
}

@injectable()
export default class BcryptPasswordHash implements PasswordHash {
  private readonly bcrypt: any
  private readonly saltRound: number

  constructor (
  @inject('bcrypt') bcrypt: IBcrypt,
    @inject('saltRound') saltRound: number = 10
  ) {
    this.bcrypt = bcrypt
    this.saltRound = saltRound
  }

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
