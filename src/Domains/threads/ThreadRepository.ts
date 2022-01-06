import NewThread from './entities/NewThread'
import AddedThread from './entities/AddedThread'
import Thread from './entities/Thread'

export default interface ThreadRepository {
  addThread: (newThread: NewThread) => Promise<AddedThread>
  getThreadById: (id: string) => Promise<Thread>
}
