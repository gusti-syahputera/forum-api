import * as faker from 'faker'

import CommentLike from '../CommentLike'

describe('a CommentLike entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // Arrange
    const payload = {
      comment_id: `comment-${faker.datatype.uuid()}`,
      user_id: undefined
    }

    // Action and Assert
    expect(() => new CommentLike(payload))
      .toThrowError('LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      comment_id: faker.datatype.array(),
      user_id: faker.datatype.array()
    }

    // Action and Assert
    expect(() => new CommentLike(payload))
      .toThrowError('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create CommentLike entities correctly', () => {
    // Arrange
    const payload = {
      comment_id: `comment-${faker.datatype.uuid()}`,
      user_id: `user-${faker.datatype.uuid()}`
    }

    // Action
    const commentLike = new CommentLike(payload)

    // Assert
    expect(commentLike.comment_id).toEqual(payload.comment_id)
    expect(commentLike.user_id).toEqual(payload.user_id)
  })
})
