import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'

import IocContainer from '../../../IocContainer'
import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase'
import ResponseRenderer from '../../ResponseRenderer'

export default class UsersHandler {
  constructor (
    private readonly container: IocContainer,
    private readonly renderer: ResponseRenderer
  ) {}

  postUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const addUserUseCase = this.container.resolve<AddUserUseCase>(AddUserUseCase)
    const addedUser = await addUserUseCase.execute(request.payload)
    return this.renderer.success(h, undefined, { addedUser }, 201)
  };
}
