import * as faker from 'faker'

import NewComment from '../NewComment'

describe('a NewComment entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      thread_id: undefined,
      owner: undefined,
      content: faker.lorem.paragraphs()
    }

    // Action & Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if payload has invalid data type', () => {
    // Arrange
    const payload = {
      thread_id: faker.datatype.number(),
      owner: faker.datatype.array(),
      content: faker.datatype.array()
    }

    // Action and Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create NewComment object properly', () => {
    // Arrange
    const payload = {
      thread_id: `thread-${faker.datatype.uuid()}`,
      owner: `user-${faker.datatype.uuid()}`,
      content: faker.lorem.paragraphs()
    }

    // Action and Assert
    const newComment = new NewComment(payload)
    expect(newComment.content).toEqual(payload.content)
    expect(newComment.thread_id).toEqual(payload.thread_id)
    expect(newComment.owner).toEqual(payload.owner)
  })
})
