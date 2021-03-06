import createServer from '../createServer'
import IocContainer from '../../../Interfaces/IocContainer'

const getContainerMock = (): IocContainer => ({
  resolve: <T>(Token): T => new Token()
})

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer(getContainerMock())

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute'
    })

    // Assert
    expect(response.statusCode).toEqual(404)
  })

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret'
    }
    const server = await createServer(getContainerMock())

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })

    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(500)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami')
  })
})
