import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager'

export interface IJwtHelper {
  generate: (payload, secret, options?) => string
  decode: (token: string, options?) => any | never
  verify: (artifacts, secret, options?) => void | never
}

export default class JwtTokenManager implements AuthenticationTokenManager {
  constructor (private readonly jwt: IJwtHelper) {}

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
      throw new Error('AUTHENTICATION.INVALID_REFRESH_TOKEN')
    }
  }

  async decodePayload (token): Promise<any> {
    const artifacts = this.jwt.decode(token)
    return artifacts.decoded.payload
  }
}
