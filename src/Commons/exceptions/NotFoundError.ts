import ClientError from './ClientError'

export default class NotFoundError extends ClientError {
  name = 'NotFoundError'
  statusCode = 404
}
