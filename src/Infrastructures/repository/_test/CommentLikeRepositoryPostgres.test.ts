import * as faker from 'faker'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../Commons/tests/ThreadsTableTestHelper'
import CommentsTableTestHelper from '../../../Commons/tests/CommentsTableTestHelper'
import CommentLikesTableTestHelper from '../../../Commons/tests/CommentLikesTableTestHelper'

import { CommentLike } from '../../../Domains/comment-likes/entities'
import CommentLikeRepositoryPostgres from '../CommentLikeRepositoryPostgres'

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => await pool.end())
  describe('addLike function', () => {
    it('should create new Like correctly', async () => {
      // Arrange entities
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })

      // Arrange input
      const newLike = new CommentLike({
        comment_id: commentData.id,
        user_id: userData.id
      })

      // Action
      const repository = new CommentLikeRepositoryPostgres(pool)
      const promise = repository.addLike(newLike)

      // Assert
      await expect(promise).resolves.not.toThrow()
      expect(CommentLikesTableTestHelper.findLike(newLike.comment_id, newLike.user_id)).toBeDefined()
    })

    it('should reject when Like already exists', async () => {
      // Arrange entities
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })
      const likeData = await CommentLikesTableTestHelper.addLike({ comment_id: commentData.id, user_id: userData.id })

      // Arrange input
      const newLike = new CommentLike(likeData)

      // Action
      const repository = new CommentLikeRepositoryPostgres(pool)
      const promise = repository.addLike(newLike)

      // Assert
      await expect(promise).rejects.toThrow('ADD_LIKE.ALREADY_EXISTS')
    })
  })

  describe('deleteLike', () => {
    it('should delete Like when it exists', async () => {
      // Arrange entities
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })
      const likeData = await CommentLikesTableTestHelper.addLike({ comment_id: commentData.id, user_id: userData.id })

      // Arrange input
      const like = new CommentLike(likeData)

      // Action
      const repository = new CommentLikeRepositoryPostgres(pool)
      const promise = repository.deleteLike(like)

      // Assert database
      await expect(promise).resolves.not.toThrow()
      expect(CommentLikesTableTestHelper.findLike(like.comment_id, like.user_id)).not.toMatchObject(like)
    })

    it('should reject when Reply does not exist', async () => {
      // Arrange random Like
      const like = new CommentLike({
        comment_id: faker.datatype.uuid(),
        user_id: faker.datatype.uuid()
      })

      // Action
      const repository = new CommentLikeRepositoryPostgres(pool)
      const promise = repository.deleteLike(like)

      // Assert
      await expect(promise).rejects.toThrowError('DELETE_LIKE.NOT_FOUND')
    })
  })
})
