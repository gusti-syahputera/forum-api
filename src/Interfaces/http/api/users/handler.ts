import { DependencyContainer } from 'tsyringe'

import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase'
import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'

export default class UsersHandler {
  private readonly container: DependencyContainer

  constructor (container: DependencyContainer) {
    this.container = container
    this.postUserHandler = this.postUserHandler.bind(this)
  }

  async postUserHandler (request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const addUserUseCase = this.container.resolve(AddUserUseCase)
    const addedUser = await addUserUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: { addedUser }
    })
    response.code(201)
    return response
  }
}
