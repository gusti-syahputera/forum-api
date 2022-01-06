import IocContainer from '../../../../Commons/IocContainer'
import ResponseRenderer from '../../ResponseRenderer'
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase'

export default class ThreadsHandler {
  constructor (
    private readonly container: IocContainer,
    private readonly renderer: ResponseRenderer
  ) {}

  postThreadHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const useCasePayload = Object.assign(request.payload as object)
    useCasePayload.owner = request.auth.credentials.userId

    const addThreadUseCase = this.container.resolve<AddThreadUseCase>(AddThreadUseCase)
    const addedThread = await addThreadUseCase.execute(useCasePayload)

    return this.renderer.success(h, undefined, { addedThread }, 201)
  };
}
