import { AddedThread, NewThread, Thread } from './entities'

export default interface ThreadRepository {
  addThread: (newThread: NewThread) => Promise<AddedThread>
  getThreadById: (id: string) => Promise<Thread>
}
