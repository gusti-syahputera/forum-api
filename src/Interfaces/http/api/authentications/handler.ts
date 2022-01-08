import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'

import IocContainer from '../../../IocContainer'
import LoginUserUseCase from '../../../../Applications/use_case/LoginUserUseCase'
import RefreshAuthenticationUseCase from '../../../../Applications/use_case/RefreshAuthenticationUseCase'
import LogoutUserUseCase from '../../../../Applications/use_case/LogoutUserUseCase'
import ResponseRenderer from '../../ResponseRenderer'

export default class AuthenticationsHandler {
  constructor (
    private readonly container: IocContainer,
    private readonly renderer: ResponseRenderer
  ) {}

  postAuthenticationHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const loginUserUseCase = this.container.resolve<LoginUserUseCase>(LoginUserUseCase)
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload)
    return this.renderer.success(h, undefined, { accessToken, refreshToken }, 201)
  }

  putAuthenticationHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const refreshAuthenticationUseCase = this.container.resolve<RefreshAuthenticationUseCase>(RefreshAuthenticationUseCase)
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload)
    return this.renderer.success(h, undefined, { accessToken })
  };

  deleteAuthenticationHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const logoutUserUseCase = this.container.resolve<LogoutUserUseCase>(LogoutUserUseCase)
    await logoutUserUseCase.execute(request.payload)
    return this.renderer.success(h)
  };
}
