import Comment from '../Comment'
import * as faker from 'faker'

describe('an Comment entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      id: `comment-${faker.datatype.uuid()}`,
      thread_id: `thread-${faker.datatype.uuid()}`,
      owner: `user-${faker.datatype.uuid()}`,
      content: undefined,
      date: undefined,
      deleted_at: faker.datatype.datetime().toISOString()
    }

    // Action and Assert
    expect(() => new Comment(payload))
      .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: faker.datatype.number(),
      thread_id: faker.datatype.number(),
      owner: faker.datatype.number(),
      content: faker.datatype.number(),
      date: faker.datatype.array(),
      deleted_at: faker.datatype.array()
    }

    // Action and Assert
    expect(() => new Comment(payload))
      .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Comment entities correctly', () => {
    // Arrange
    const payload1 = {
      id: `comment-${faker.datatype.uuid()}`,
      thread_id: `thread-${faker.datatype.uuid()}`,
      owner: `user-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs(),
      date: faker.datatype.datetime().toISOString(),
      deleted_at: faker.datatype.datetime().toISOString()
    }
    const payload2 = { ...payload1, deleted_at: null }

    // Action
    const comment1 = new Comment(payload1)
    const comment2 = new Comment(payload2)

    // Assert
    expect(comment1.id).toEqual(payload1.id)
    expect(comment1.thread_id).toEqual(payload1.thread_id)
    expect(comment1.owner).toEqual(payload1.owner)
    expect(comment1.content).toEqual(payload1.content)
    expect(comment1.date).toEqual(payload1.date)
    expect(comment1.deleted_at).toEqual(payload1.deleted_at)
    expect(comment2.deleted_at).toEqual(payload2.deleted_at)
  })
})
