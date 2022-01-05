import AddedThread from '../AddedThread'

describe('an AddedThread entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'sebuah judul'
      // owner: undefined
    }

    // Action and Assert
    expect(() => new AddedThread(payload))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // arrange
    const payload = {
      id: 123,
      title: true,
      owner: []
    }

    // action and assert
    expect(() => new AddedThread(payload))
      .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1',
      title: 'sebuah judul',
      owner: 'user-1'
    }

    // Action
    const addedThread = new AddedThread(payload)

    // Assert
    expect(addedThread.id).toEqual(payload.id)
    expect(addedThread.title).toEqual(payload.title)
    expect(addedThread.owner).toEqual(payload.owner)
  })
})
