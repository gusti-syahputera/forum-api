import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'

import IocContainer from '../../../../Commons/IocContainer'
import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase'

export default class UsersHandler {
  constructor (private readonly container: IocContainer) {}

  postUserHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const addUserUseCase = this.container.resolve<AddUserUseCase>(AddUserUseCase)
    const addedUser = await addUserUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: { addedUser }
    })
    response.code(201)
    return response
  };
}
