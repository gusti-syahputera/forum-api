import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'

import IocContainer from '../../../IocContainer'
import ResponseRenderer from '../../ResponseRenderer'
import AddReplyUseCase, { Payload as AddReplyUseCasePayload } from '../../../../Applications/use_case/AddReplyUseCase'
import DeleteReplyUseCase, { Payload as DeleteReplyUseCasePayload } from '../../../../Applications/use_case/DeleteReplyUseCase'

export default class RepliesHandler {
  constructor (
    private readonly container: IocContainer,
    private readonly renderer: ResponseRenderer
  ) {}

  postReplyHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const useCasePayload: AddReplyUseCasePayload = Object.assign(request.payload as object)
    useCasePayload.owner = request.auth.credentials.userId as string
    useCasePayload.thread_id = request.params.threadId
    useCasePayload.comment_id = request.params.commentId

    const addReplyUseCase = this.container.resolve<AddReplyUseCase>(AddReplyUseCase)
    const addedReply = await addReplyUseCase.execute(useCasePayload)

    return this.renderer.success(h, undefined, { addedReply }, 201)
  };

  deleteReplyHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const useCasePayload: DeleteReplyUseCasePayload = {
      userId: request.auth.credentials.userId as string,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      replyId: request.params.replyId
    }

    const deleteReplyUseCase = this.container.resolve<DeleteReplyUseCase>(DeleteReplyUseCase)
    await deleteReplyUseCase.execute(useCasePayload)

    return this.renderer.success(h)
  }
}
