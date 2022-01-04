import ClientError from './ClientError'

export default class AuthorizationError extends ClientError {
  name = 'AuthorizationError'
  statusCode = 403
}
