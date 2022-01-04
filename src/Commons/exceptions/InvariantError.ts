import ClientError from './ClientError'

export default class InvariantError extends ClientError {
  name = 'InvariantError'
  statusCode = 400
}
