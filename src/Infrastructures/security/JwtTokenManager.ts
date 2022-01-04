import 'reflect-metadata'

import { inject, injectable } from 'tsyringe'

import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager'
import InvariantError from '../../Commons/exceptions/InvariantError'

export interface IJwtHelper {
  generate: (payload, secret, options?) => string
  decode: (token: string, options?) => any | never
  verify: (artifacts, secret, options?) => void | never
}

@injectable()
export default class JwtTokenManager implements AuthenticationTokenManager {
  private readonly jwt: IJwtHelper;

  constructor (@inject('jwt') jwt: IJwtHelper) {
    this.jwt = jwt
  }

  async createAccessToken (payload): Promise<string> {
    return this.jwt.generate(payload, process.env.ACCESS_TOKEN_KEY)
  }

  async createRefreshToken (payload): Promise<string> {
    return this.jwt.generate(payload, process.env.REFRESH_TOKEN_KEY)
  }

  async verifyRefreshToken (token): Promise<void> {
    try {
      const artifacts = this.jwt.decode(token)
      this.jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY)
    } catch (error) {
      throw new InvariantError('refresh token tidak valid')
    }
  }

  async decodePayload (token): Promise<any> {
    const artifacts = this.jwt.decode(token)
    return artifacts.decoded.payload
  }
}
