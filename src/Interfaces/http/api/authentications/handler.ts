import { DependencyContainer } from 'tsyringe'
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'

import LoginUserUseCase from '../../../../Applications/use_case/LoginUserUseCase'
import RefreshAuthenticationUseCase from '../../../../Applications/use_case/RefreshAuthenticationUseCase'
import LogoutUserUseCase from '../../../../Applications/use_case/LogoutUserUseCase'

export default class AuthenticationsHandler {
  private readonly container: DependencyContainer

  constructor (container: DependencyContainer) {
    this.container = container
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
  }

  async postAuthenticationHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const loginUserUseCase = this.container.resolve(LoginUserUseCase)
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthenticationHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const refreshAuthenticationUseCase = this.container.resolve(RefreshAuthenticationUseCase)
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload)

    return h.response({
      status: 'success',
      data: { accessToken }
    })
  }

  async deleteAuthenticationHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const logoutUserUseCase = this.container.resolve(LogoutUserUseCase)
    await logoutUserUseCase.execute(request.payload)
    return h.response({ status: 'success' })
  }
}
