export default interface AuthenticationRepository {
  addToken: (token: string) => Promise<any>
  checkAvailabilityToken: (token: string) => Promise<any>
  deleteToken: (token: string) => Promise<any>
}
