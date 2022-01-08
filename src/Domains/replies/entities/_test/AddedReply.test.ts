import * as faker from 'faker'

import AddedReply from '../AddedReply'

describe('an AddedReply entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      id: `reply-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs(),
      owner: undefined
    }

    // Action and Assert
    expect(() => new AddedReply(payload))
      .toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: faker.datatype.number(),
      content: faker.datatype.array(),
      owner: faker.datatype.array()
    }

    // Action and Assert
    expect(() => new AddedReply(payload))
      .toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedComment object properly', () => {
    // Arrange
    const payload = {
      id: `reply-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs(),
      owner: `user-${faker.datatype.uuid()}`
    }

    // Action and Assert
    const addedComment = new AddedReply(payload)
    expect(addedComment.id).toEqual(payload.id)
    expect(addedComment.content).toEqual(payload.content)
    expect(addedComment.owner).toEqual(payload.owner)
  })
})
