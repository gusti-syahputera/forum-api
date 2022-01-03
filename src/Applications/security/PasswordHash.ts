export default interface PasswordHash {
  hash: (password: string) => Promise<string>
  comparePassword: (plain: string, encrypted: string) => Promise<void>
}
