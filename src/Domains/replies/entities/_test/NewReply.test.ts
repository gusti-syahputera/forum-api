import * as faker from 'faker'

import NewReply from '../NewReply'

describe('a NewReply entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      comment_id: undefined,
      owner: undefined,
      content: faker.lorem.paragraphs()
    }

    // Action & Assert
    expect(() => new NewReply(payload))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if payload has invalid data type', () => {
    // Arrange
    const payload = {
      comment_id: faker.datatype.number(),
      owner: faker.datatype.array(),
      content: faker.datatype.array()
    }

    // Action and Assert
    expect(() => new NewReply(payload))
      .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewReply object properly', () => {
    // Arrange
    const payload = {
      comment_id: `comment-${faker.datatype.uuid()}`,
      owner: `user-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs()
    }

    // Action and Assert
    const newComment = new NewReply(payload)
    expect(newComment.content).toEqual(payload.content)
    expect(newComment.comment_id).toEqual(payload.comment_id)
    expect(newComment.owner).toEqual(payload.owner)
  })
})
