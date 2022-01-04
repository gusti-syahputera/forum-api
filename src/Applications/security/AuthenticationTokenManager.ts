export default interface AuthenticationTokenManager {
  createRefreshToken: (payload) => Promise<string>
  createAccessToken: (payload) => Promise<string>
  verifyRefreshToken: (token: string) => Promise<any>
  decodePayload: (payload) => Promise<any>
}
