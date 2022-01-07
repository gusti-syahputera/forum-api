import IocContainer from '../../../IocContainer'
import ResponseRenderer from '../../ResponseRenderer'
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'
import AddCommentUseCase, { Payload as AddCommentUseCasePayload } from '../../../../Applications/use_case/AddCommentUseCase'
import DeleteCommentUseCase, { Payload as DeleteCommentUseCasePayload } from '../../../../Applications/use_case/DeleteCommentUseCase'

export default class CommentsHandler {
  constructor (
    private readonly container: IocContainer,
    private readonly renderer: ResponseRenderer
  ) {}

  postCommentHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const useCasePayload: AddCommentUseCasePayload = Object.assign(request.payload as object)
    useCasePayload.owner = request.auth.credentials.userId as string
    useCasePayload.thread_id = request.params.threadId

    const addCommentUseCase = this.container.resolve<AddCommentUseCase>(AddCommentUseCase)
    const addedComment = await addCommentUseCase.execute(useCasePayload)

    return this.renderer.success(h, undefined, { addedComment }, 201)
  };

  deleteCommentHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const useCasePayload: DeleteCommentUseCasePayload = {
      userId: request.auth.credentials.userId as string,
      threadId: request.params.threadId,
      commentId: request.params.commentId
    }

    const deleteCommentUseCase = this.container.resolve<DeleteCommentUseCase>(DeleteCommentUseCase)
    await deleteCommentUseCase.execute(useCasePayload)

    return this.renderer.success(h)
  }
}
