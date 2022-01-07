import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../Commons/tests/ThreadsTableTestHelper'
import CommentsTableTestHelper from '../../../Commons/tests/CommentsTableTestHelper'
import ReplyTableTestHelper from '../../../Commons/tests/ReplyTableTestHelper'

import { AddedReply, CommentReply, Reply, NewReply } from '../../../Domains/replies/entities'
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const prepareTwoUsers = async () => await Promise.all([
  UsersTableTestHelper.addUser({}),
  UsersTableTestHelper.addUser({})
])

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => await pool.end())

  describe('addReply function', () => {
    it('should create new Reply and return AddedReply correctly', async () => {
      // Arrange entities
      const [userData1, userData2] = await prepareTwoUsers()
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData1.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData1.id })

      // Arrange doubles
      const fakeId = faker.datatype.uuid()
      const generateIdStub = (): string => fakeId
      const getCurrentTimeMock = createMock<() => string>()

      // Arrange inputs
      const newReply = new NewReply({
        content: faker.lorem.paragraphs(),
        comment_id: commentData.id,
        owner: userData2.id
      })

      // Action
      const repository = new ReplyRepositoryPostgres(pool, generateIdStub, getCurrentTimeMock)
      const addedReply = await repository.addReply(newReply)

      // Assert returned value
      expect(addedReply).toStrictEqual(new AddedReply({
        id: `reply-${fakeId}`,
        content: newReply.content,
        owner: newReply.owner
      }))

      // Assert database
      expect(ReplyTableTestHelper.findReplyById(addedReply.id)).toBeDefined()
    })
  })

  describe('deleteReplyById', () => {
    it('should delete Reply when it exists', async () => {
      // Arrange entities
      const [userData1, userData2] = await prepareTwoUsers()
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData1.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData2.id })
      const replyData = await ReplyTableTestHelper.addReply({ comment_id: commentData.id, owner: userData1.id })

      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const fakeDeletionDate = new Date().toISOString()
      const getCurrentTimeFake = (): string => fakeDeletionDate

      // Action
      const repository = new ReplyRepositoryPostgres(pool, generateIdMock, getCurrentTimeFake)
      await repository.deleteReplyById(replyData.id)

      // Assert database
      const storedReply = await ReplyTableTestHelper.findReplyById(replyData.id)
      expect(storedReply.deleted_at).toStrictEqual(fakeDeletionDate)
    })

    it('should reject when Reply does not exist', async () => {
      // Arrange
      const randomId = faker.datatype.uuid()

      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const getCurrentTimeMock = createMock<() => string>()

      // Action
      const repository = new ReplyRepositoryPostgres(pool, generateIdMock, getCurrentTimeMock)
      const promise = repository.deleteReplyById(randomId)

      // Assert
      await expect(promise).rejects.toThrowError('DELETE_REPLY.REPLY_NOT_FOUND')
    })
  })

  describe('getReplyById', () => {
    it('should return Reply when it exists', async () => {
      // Arrange entities
      const [userData1, userData2] = await prepareTwoUsers()
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData1.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData2.id })
      const replyData = await ReplyTableTestHelper.addReply({ comment_id: commentData.id, owner: userData1.id })

      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const getCurrentTimeMock = createMock<() => string>()

      // Action
      const repository = new ReplyRepositoryPostgres(pool, generateIdMock, getCurrentTimeMock)
      const reply = await repository.getReplyById(replyData.id)

      // Assert
      const expectedReply = new Reply(replyData)
      expect(reply).toStrictEqual(expectedReply)
    })

    it('should reject when Reply does not exist', async () => {
      // Arrange
      const randomId = faker.datatype.uuid()

      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const getCurrentTimeMock = createMock<() => string>()

      // Action
      const repository = new ReplyRepositoryPostgres(pool, generateIdMock, getCurrentTimeMock)
      const promise = repository.getReplyById(randomId)

      // Assert
      await expect(promise).rejects.toThrowError('REPLY.NOT_FOUND')
    })
  })

  describe('getRepliesByThreadId', () => {
    it('should return Replies of a Thread', async () => {
      // Arrange entities
      const userData = await UsersTableTestHelper.addUser({})
      const threadData = await ThreadsTableTestHelper.addThread({ owner: userData.id })
      const commentData = await CommentsTableTestHelper.addComment({ thread_id: threadData.id, owner: userData.id })

      // Arrange Replies
      const replyCounts = 5
      const repliesData = await Promise.all([...Array(replyCounts).keys()].map(
        async () => await ReplyTableTestHelper.addReply({ comment_id: commentData.id, owner: userData.id })
      ))

      // Arrange doubles
      const generateIdMock = createMock<() => string>()
      const getCurrentTimeMock = createMock<() => string>()

      // Action
      const repository = new ReplyRepositoryPostgres(pool, generateIdMock, getCurrentTimeMock)
      const replies = await repository.getRepliesByThreadId(threadData.id)

      // Assert
      const expectedComment = repliesData
        .map(commentData => new CommentReply({ ...commentData, username: userData.username }))
        .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      expect(replies).toStrictEqual(expectedComment)
    })
  })
})
