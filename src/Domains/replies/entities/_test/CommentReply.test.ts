import * as faker from 'faker'

import CommentReply from '../CommentReply'

describe('an CommentReply entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      id: `reply-${faker.datatype.uuid()}`,
      username: faker.internet.userName(),
      date: undefined,
      content: undefined,
      deleted_at: faker.datatype.datetime().toISOString()
    }

    // Action and Assert
    expect(() => new CommentReply(payload))
      .toThrowError('COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: faker.datatype.number(),
      username: faker.datatype.array(),
      date: faker.datatype.array(),
      content: faker.datatype.array(),
      deleted_at: Symbol('')
    }

    // Action and Assert
    expect(() => new CommentReply(payload))
      .toThrowError('COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create CommentReply entities correctly', () => {
    // Arrange
    const payload1 = {
      id: `reply-${faker.datatype.uuid()}`,
      comment_id: `comment-${faker.datatype.uuid()}`,
      username: faker.internet.userName(),
      date: faker.datatype.datetime().toISOString(),
      content: faker.lorem.paragraphs(),
      deleted_at: faker.datatype.datetime().toISOString()
    }
    const payload2 = { ...payload1, deleted_at: null }

    // Action
    const commentReply1 = new CommentReply(payload1)
    const commentReply2 = new CommentReply(payload2)

    // Assert
    expect(commentReply1.id).toEqual(payload1.id)
    expect(commentReply1.username).toEqual(payload1.username)
    expect(commentReply1.date).toEqual(payload1.date)
    expect(commentReply1.content).toEqual(payload1.content)
    expect(commentReply1.date).toEqual(payload1.date)
    expect(commentReply1.deleted_at).toEqual(payload1.deleted_at)
    expect(commentReply2.deleted_at).toEqual(payload2.deleted_at)
  })
})
