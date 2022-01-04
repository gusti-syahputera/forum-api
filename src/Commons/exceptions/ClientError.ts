export default abstract class ClientError extends Error {
  name = 'ClientError'
  statusCode: number = 400
}
