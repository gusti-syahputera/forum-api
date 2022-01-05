import Thread from '../Thread'

describe('an AddedThread entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'sebuah judul',
      body: 'isi thread',
      date: undefined,
      comments: undefined
    }

    // Action and Assert
    expect(() => new Thread(payload))
      .toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: 1,
      title: 2,
      body: 3,
      date: [],
      username: 4,
      comments: 'komentar aneh'
    }

    // Action and Assert
    expect(() => new Thread(payload))
      .toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Thread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'sebuah judul',
      body: 'isi teks thread',
      date: '2022-01-01T00:00:00.000Z',
      username: 'gustisyahputera',
      comments: []
    }

    // Action
    const thread = new Thread(payload)

    // Assert
    expect(thread.id).toEqual(payload.id)
    expect(thread.title).toEqual(payload.title)
    expect(thread.body).toEqual(payload.body)
    expect(thread.date).toEqual(payload.date)
    expect(thread.username).toEqual(payload.username)
    expect(thread.comments).toEqual(payload.comments)
  })
})
