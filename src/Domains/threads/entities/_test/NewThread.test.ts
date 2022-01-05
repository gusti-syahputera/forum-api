import NewThread from '../NewThread'

describe('a NewThread entity', () => {
  it('should throw error when payload does not meet criteria', () => {
    // Arrange
    const payload = {
      title: 'sebuah judul',
      body: 'isi thread'
      // owner: undefined
    }

    // Action and Assert
    expect(() => new NewThread(payload))
      .toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: []
    }

    // Action and Assert
    expect(() => new NewThread(payload))
      .toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'sebuah judul',
      body: 'isi thread',
      owner: 'user-123'
    }

    // Action
    const newThread = new NewThread(payload)

    // Assert
    expect(newThread.title).toEqual(payload.title)
    expect(newThread.body).toEqual(payload.body)
  })
})
