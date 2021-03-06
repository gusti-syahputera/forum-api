import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../Commons/tests/ThreadsTableTestHelper'
import CommentsTableTestHelper from '../../../Commons/tests/CommentsTableTestHelper'
import CommentLikesTableTestHelper from '../../../Commons/tests/CommentLikesTableTestHelper'

import { AddedComment, Comment, NewComment, ThreadComment } from '../../../Domains/comments/entities'
import CommentRepositoryPostgres from '../CommentRepositoryPostgres'

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => await Promise.all([
    await CommentsTableTestHelper.cleanTable(),
    await ThreadsTableTestHelper.cleanTable(),
    await UsersTableTestHelper.cleanTable()
  ]))

  afterAll(async () => await pool.end())

  describe('addComment function', () => {
    it('should create new comment and return added comment correctly', async () => {
      // Arrange entities
      const user1 = await UsersTableTestHelper.addUser({})
      const user2 = await UsersTableTestHelper.addUser({})
      const thread = await ThreadsTableTestHelper.addThread({ owner: user1.id })

      // Arrange doubles
      const fakeId = faker.datatype.uuid()
      const generateIdStub = (): string => fakeId
      const getCurrentTimeMock = createMock<() => string>()

      // Arrange inputs
      const newComment = new NewComment({
        content: faker.lorem.paragraphs(),
        thread_id: thread.id,
        owner: user2.id
      })

      // Action
      const repository = new CommentRepositoryPostgres(pool, generateIdStub, getCurrentTimeMock)
      const addedComment = await repository.addComment(newComment)

      // Assert returned value
      expect(addedComment).toStrictEqual(new AddedComment({
        id: `comment-${fakeId}`,
        content: newComment.content,
        owner: newComment.owner
      }))

      // Assert database
      expect(CommentsTableTestHelper.findCommentById(addedComment.id)).toBeDefined()
    })
  })

  describe('deleteCommentById', () => {
    it('should delete comment when comment exists', async () => {
      // Arrange entities
      const [userData1, userData2] = await Promise.all([
        UsersTableTestHelper.addUser({}),
        UsersTableTestHelper.addUser({})
      ])
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData1.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData2.id })

      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const fakeDeletionDate = new Date().toISOString()
      const getCurrentTimeFake = (): string => fakeDeletionDate

      // Action
      const repository = new CommentRepositoryPostgres(pool, generateIdMock, getCurrentTimeFake)
      await repository.deleteCommentById(commentData.id)

      // Assert database
      const storedComment = await CommentsTableTestHelper.findCommentById(commentData.id)
      expect(storedComment.deleted_at).toStrictEqual(fakeDeletionDate)
    })

    it('should reject when comment does not exist', async () => {
      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const getCurrentTimeMock = createMock<() => string>()

      // Arrange
      const randomId = faker.datatype.uuid()

      // Action and Assert
      const repository = new CommentRepositoryPostgres(pool, generateIdMock, getCurrentTimeMock)
      await expect(repository.deleteCommentById(randomId)).rejects.toThrowError('DELETE_COMMENT.NOT_FOUND')
    })
  })

  describe('getCommentById', () => {
    it('should return Comment when it exists', async () => {
      // Arrange entities
      const [userData1, userData2] = await Promise.all([
        UsersTableTestHelper.addUser({}),
        UsersTableTestHelper.addUser({})
      ])
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData1.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData2.id })

      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const getCurrentTimeMock = createMock<() => string>()

      // Action
      const repository = new CommentRepositoryPostgres(pool, generateIdMock, getCurrentTimeMock)
      const comment = await repository.getCommentById(commentData.id)

      // Assert
      const expectedComment = new Comment(commentData)
      expect(comment).toStrictEqual(expectedComment)
    })

    it('should reject when Comment does not exist', async () => {
      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const getCurrentTimeMock = createMock<() => string>()

      // Arrange
      const randomId = faker.datatype.uuid()

      // Action and Assert
      const repository = new CommentRepositoryPostgres(pool, generateIdMock, getCurrentTimeMock)
      await expect(repository.getCommentById(randomId)).rejects.toThrowError('COMMENT.NOT_FOUND')
    })
  })

  describe('getCommentsByThreadId', () => {
    it('should return Comments of a Thread', async () => {
      // Arrange entities
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })

      // Arrange Comments
      const commentCounts = 5
      const commentsData = await Promise.all([...Array(commentCounts).keys()].map(
        async () => await CommentsTableTestHelper
          .addComment({ thread_id: threadData.id, owner: userData.id })
      ))

      // Arrange CommentLike
      const likeData = await CommentLikesTableTestHelper.addLike({
        comment_id: faker.random.arrayElement(commentsData).id,
        user_id: userData.id
      })

      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const getCurrentTimeMock = createMock<() => string>()

      // Action
      const repository = new CommentRepositoryPostgres(pool, generateIdMock, getCurrentTimeMock)
      const comments = await repository.getCommentsByThreadId(threadData.id)

      // Assert
      const expectedComments = commentsData
        .map(commentData => new ThreadComment({ ...commentData, username: userData.username, like_counts: 0 }))
        .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      const likedComment = expectedComments.find(comment => comment.id === likeData.comment_id)
      if (likedComment !== undefined) likedComment.likeCount = 1
      expect(comments).toStrictEqual(expectedComments)
    })
  })
})
