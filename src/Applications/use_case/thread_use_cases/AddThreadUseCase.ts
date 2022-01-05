import ThreadRepository from '../../../Domains/threads/ThreadRepository'
import { AddedThread, NewThread } from '../../../Domains/threads/entities'

export default class AddThreadUseCase {
  constructor (
    private readonly threadRepository: ThreadRepository
  ) {}

  execute = async (useCasePayload): Promise<AddedThread> => {
    const newThread = new NewThread(useCasePayload)
    return await this.threadRepository.addThread(newThread)
  }
}
