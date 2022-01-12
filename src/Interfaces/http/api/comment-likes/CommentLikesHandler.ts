import IocContainer from '../../../IocContainer'
import ResponseRenderer from '../../ResponseRenderer'
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'
import ToggleCommentLikeUseCase, {
  Payload as ToggleCommentLikeUseCasePayload
} from '../../../../Applications/use_case/ToggleCommentLikeUseCase'

export default class CommentLikesHandler {
  constructor (
    private readonly container: IocContainer,
    private readonly renderer: ResponseRenderer
  ) {}

  putCommentLikeHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const useCasePayload: ToggleCommentLikeUseCasePayload = {
      thread_id: request.params.threadId,
      comment_id: request.params.commentId,
      user_id: request.auth.credentials.userId as string
    }

    const toggleCommentLikeUseCase = this.container.resolve<ToggleCommentLikeUseCase>(ToggleCommentLikeUseCase)
    await toggleCommentLikeUseCase.execute(useCasePayload)

    return this.renderer.success(h)
  };
}
