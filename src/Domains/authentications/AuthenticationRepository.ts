export default interface AuthenticationRepository {
  addToken: (token: string) => Promise<any>
  checkAvailabilityToken: (token: string) => Promise<void>
  deleteToken: (token: string) => Promise<any>
}
