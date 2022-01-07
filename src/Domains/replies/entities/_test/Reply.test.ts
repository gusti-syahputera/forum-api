import * as faker from 'faker'

import Reply from '../Reply'

describe('an Reply entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      id: `reply-${faker.datatype.uuid()}`,
      comment_id: `comment-${faker.datatype.uuid()}`,
      owner: `user-${faker.datatype.uuid()}`,
      content: undefined,
      date: undefined,
      deleted_at: faker.datatype.datetime().toISOString()
    }

    // Action and Assert
    expect(() => new Reply(payload))
      .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: faker.datatype.number(),
      comment_id: faker.datatype.number(),
      owner: faker.datatype.number(),
      content: faker.datatype.number(),
      date: faker.datatype.array(),
      deleted_at: faker.datatype.array()
    }

    // Action and Assert
    expect(() => new Reply(payload))
      .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create Reply entities correctly', () => {
    // Arrange
    const payload1 = {
      id: `reply-${faker.datatype.uuid()}`,
      comment_id: `comment-${faker.datatype.uuid()}`,
      owner: `user-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs(),
      date: faker.datatype.datetime().toISOString(),
      deleted_at: faker.datatype.datetime().toISOString()
    }
    const payload2 = { ...payload1, deleted_at: null }

    // Action
    const reply1 = new Reply(payload1)
    const reply2 = new Reply(payload2)

    // Assert
    expect(reply1.id).toEqual(payload1.id)
    expect(reply1.comment_id).toEqual(payload1.comment_id)
    expect(reply1.owner).toEqual(payload1.owner)
    expect(reply1.content).toEqual(payload1.content)
    expect(reply1.date).toEqual(payload1.date)
    expect(reply1.deleted_at).toEqual(payload1.deleted_at)
    expect(reply2.deleted_at).toEqual(payload2.deleted_at)
  })
})
