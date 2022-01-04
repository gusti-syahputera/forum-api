import ClientError from './ClientError'

export default class AuthenticationError extends ClientError {
  name = 'AuthenticationError'
  statusCode = 401
}
