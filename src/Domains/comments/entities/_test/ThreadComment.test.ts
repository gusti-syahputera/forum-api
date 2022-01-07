import ThreadComment from '../ThreadComment'
import * as faker from 'faker'

describe('an ThreadComment entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      id: `comment-${faker.datatype.uuid()}`,
      username: faker.internet.userName(),
      date: undefined,
      content: undefined,
      deleted_at: faker.datatype.datetime().toISOString(),
      replies: []
    }

    // Action and Assert
    expect(() => new ThreadComment(payload))
      .toThrowError('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: faker.datatype.number(),
      username: faker.datatype.array(),
      date: faker.datatype.array(),
      content: faker.datatype.array(),
      deleted_at: Symbol(''),
      replies: []
    }

    // Action and Assert
    expect(() => new ThreadComment(payload))
      .toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create ThreadComment entities correctly', () => {
    // Arrange
    const payload1 = {
      id: `comment-${faker.datatype.uuid()}`,
      username: faker.internet.userName(),
      date: faker.datatype.datetime().toISOString(),
      content: faker.lorem.paragraphs(),
      deleted_at: faker.datatype.datetime().toISOString(),
      replies: []
    }
    const payload2 = { ...payload1, deleted_at: null }

    // Action
    const comment1 = new ThreadComment(payload1)
    const comment2 = new ThreadComment(payload2)

    // Assert
    expect(comment1.id).toEqual(payload1.id)
    expect(comment1.username).toEqual(payload1.username)
    expect(comment1.date).toEqual(payload1.date)
    expect(comment1.content).toEqual(payload1.content)
    expect(comment1.date).toEqual(payload1.date)
    expect(comment1.deleted_at).toEqual(payload1.deleted_at)
    expect(comment2.deleted_at).toEqual(payload2.deleted_at)
  })
})
