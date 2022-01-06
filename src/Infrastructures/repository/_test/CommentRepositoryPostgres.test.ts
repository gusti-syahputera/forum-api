import * as faker from 'faker'
import { createMock } from 'ts-auto-mock'

import pool from '../../database/postgres/pool'
import UsersTableTestHelper from '../../../Commons/tests/UsersTableTestHelper'
import ThreadsTableTestHelper from '../../../Commons/tests/ThreadsTableTestHelper'
import CommentsTableTestHelper from '../../../Commons/tests/CommentsTableTestHelper'
import { AddedComment, NewComment } from '../../../Domains/comments/entities'
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
})
