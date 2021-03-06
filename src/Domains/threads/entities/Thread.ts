export default class Thread<Comment = any> {
    id: string
    body: string
    title: string
    username: string
    comments?: Comment[]
    date: string

    constructor (payload) {
      ({
        id: this.id,
        title: this.title,
        body: this.body,
        date: this.date,
        username: this.username,
        comments: this.comments
      } = this.verifyPayload(payload))
    }

    private verifyPayload (payload): {
      id: string
      body: string
      title: string
      username: string
      comments: []
      date: string
    } {
      const {
        id,
        body,
        title,
        username,
        comments,
        date
      } = payload

      if (!id || !title || !body || !date || !username) {
        throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
      }

      if (typeof id !== 'string' ||
        typeof title !== 'string' ||
        typeof body !== 'string' ||
        typeof date !== 'string' ||
        typeof username !== 'string' ||
        (!!comments && !(Array.isArray(comments)))
      ) {
        throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
      }

      return payload
    }
}
