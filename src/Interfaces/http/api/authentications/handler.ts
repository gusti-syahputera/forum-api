import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'

import IocContainer from '../../../../Commons/IocContainer'
import LoginUserUseCase from '../../../../Applications/use_case/LoginUserUseCase'
import RefreshAuthenticationUseCase from '../../../../Applications/use_case/RefreshAuthenticationUseCase'
import LogoutUserUseCase from '../../../../Applications/use_case/LogoutUserUseCase'

export default class AuthenticationsHandler {
  private readonly container: IocContainer

  constructor (container: IocContainer) {
    this.container = container
  }

  postAuthenticationHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const loginUserUseCase = this.container.resolve<LoginUserUseCase>(LoginUserUseCase)
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

  putAuthenticationHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const refreshAuthenticationUseCase = this.container.resolve<RefreshAuthenticationUseCase>(RefreshAuthenticationUseCase)
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload)

    return h.response({
      status: 'success',
      data: { accessToken }
    })
  };

  deleteAuthenticationHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const logoutUserUseCase = this.container.resolve<LogoutUserUseCase>(LogoutUserUseCase)
    await logoutUserUseCase.execute(request.payload)
    return h.response({ status: 'success' })
  };
}
