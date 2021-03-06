/* istanbul ignore file */

import { container } from 'tsyringe'

import IocContainer from '../Interfaces/IocContainer'

// External dependencies
import { nanoid } from 'nanoid'
import * as bcrypt from 'bcrypt'
import * as Jwt from '@hapi/jwt'
import pool from './database/postgres/pool'

// Service (repository, helper, manager, etc)
import UserRepositoryPostgres from './repository/UserRepositoryPostgres'
import BcryptPasswordHash from './security/BcryptPasswordHash'
import JwtTokenManager from './security/JwtTokenManager'
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres'

import AddUserUseCase from '../Applications/use_case/AddUserUseCase'
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase'
import LogoutUserUseCase from '../Applications/use_case/LogoutUserUseCase'
import RefreshAuthenticationUseCase from '../Applications/use_case/RefreshAuthenticationUseCase'
import ThreadRepositoryPostgres from './repository/ThreadRepositoryPostgres'
import AddThreadUseCase from '../Applications/use_case/AddThreadUseCase'
import AddCommentUseCase from '../Applications/use_case/AddCommentUseCase'
import DeleteCommentUseCase from '../Applications/use_case/DeleteCommentUseCase'
import CommentRepositoryPostgres from './repository/CommentRepositoryPostgres'
import ReplyRepositoryPostgres from './repository/ReplyRepositoryPostgres'
import CommentLikeRepositoryPostgres from './repository/CommentLikeRepositoryPostgres'
import GetThreadWithCommentsUseCase from '../Applications/use_case/GetThreadWithCommentsUseCase'
import GetThreadWithCommentsAndRepliesUseCase from '../Applications/use_case/GetThreadWithCommentsAndRepliesUseCase'
import AddReplyUseCase from '../Applications/use_case/AddReplyUseCase'
import DeleteReplyUseCase from '../Applications/use_case/DeleteReplyUseCase'
import ToggleCommentLikeUseCase from '../Applications/use_case/ToggleCommentLikeUseCase'

/* eslint-disable symbol-description */
export const tokens = {
  pool: Symbol(),
  idGenerator: Symbol(),
  generateId: Symbol(),
  getCurrentTime: Symbol(),
  bcrypt: Symbol(),
  saltRound: Symbol(),
  jwt: Symbol(),
  deletedCommentContentMask: Symbol(),
  deletedReplyContentMask: Symbol(),
  UserRepository: Symbol(),
  PasswordHash: Symbol(),
  AuthenticationRepository: Symbol(),
  AuthenticationTokenManager: Symbol(),
  ThreadsRepository: Symbol(),
  CommentsRepository: Symbol(),
  ReplyRepository: Symbol(),
  CommentLikeRepository: Symbol()
}
/* eslint-enable symbol-description */
const t = tokens

/* Registering dependencies of services */

container.register(t.pool, { useValue: pool })
container.register(t.idGenerator, { useValue: nanoid })
container.register(t.generateId, { useValue: nanoid })
container.register(t.getCurrentTime, { useValue: () => new Date().toISOString() })
container.register(t.bcrypt, { useValue: bcrypt })
container.register(t.saltRound, { useValue: 10 })
container.register(t.jwt, { useValue: Jwt.token })
container.register(t.deletedCommentContentMask, { useValue: '**komentar telah dihapus**' })
container.register(t.deletedReplyContentMask, { useValue: '**balasan telah dihapus**' })

/* Registering use case class' factories */

container.register(t.UserRepository, {
  useFactory: (c) => new UserRepositoryPostgres(c.resolve(t.pool), c.resolve(t.idGenerator))
})

container.register(t.PasswordHash, {
  useFactory: (c) => new BcryptPasswordHash(c.resolve(t.bcrypt), c.resolve(t.saltRound))
})

container.register(t.AuthenticationRepository, {
  useFactory: (c) => new AuthenticationRepositoryPostgres(c.resolve(t.pool))
})

container.register(t.AuthenticationTokenManager, {
  useFactory: (c) => new JwtTokenManager(c.resolve(t.jwt))
})

container.register(t.ThreadsRepository, {
  useFactory: (c) => new ThreadRepositoryPostgres(
    c.resolve(t.pool), c.resolve(t.generateId), c.resolve(t.getCurrentTime)
  )
})

container.register(t.CommentsRepository, {
  useFactory: (c) => new CommentRepositoryPostgres(
    c.resolve(t.pool), c.resolve(t.generateId), c.resolve(t.getCurrentTime)
  )
})

container.register(t.ReplyRepository, {
  useFactory: (c) => new ReplyRepositoryPostgres(
    c.resolve(t.pool), c.resolve(t.generateId), c.resolve(t.getCurrentTime)
  )
})

container.register(t.CommentLikeRepository, {
  useFactory: (c) => new CommentLikeRepositoryPostgres(c.resolve(t.pool))
})

container.register(AddUserUseCase, {
  useFactory: (c) => new AddUserUseCase(c.resolve(t.UserRepository), c.resolve(t.PasswordHash))
})

container.register(LoginUserUseCase, {
  useFactory: (c) => new LoginUserUseCase(
    c.resolve(t.UserRepository),
    c.resolve(t.AuthenticationRepository),
    c.resolve(t.AuthenticationTokenManager),
    c.resolve(t.PasswordHash)
  )
})

container.register(LogoutUserUseCase, {
  useFactory: (c) => new LogoutUserUseCase(c.resolve(t.AuthenticationRepository))
})

container.register(RefreshAuthenticationUseCase, {
  useFactory: (c) => new RefreshAuthenticationUseCase(
    c.resolve(t.AuthenticationRepository),
    c.resolve(t.AuthenticationTokenManager)
  )
})

container.register(AddThreadUseCase, {
  useFactory: (c) => new AddThreadUseCase(c.resolve(t.ThreadsRepository))
})

container.register(AddCommentUseCase, {
  useFactory: (c) => new AddCommentUseCase(
    c.resolve(t.ThreadsRepository), c.resolve(t.CommentsRepository)
  )
})

container.register(DeleteCommentUseCase, {
  useFactory: (c) => new DeleteCommentUseCase(
    c.resolve(t.ThreadsRepository), c.resolve(t.CommentsRepository)
  )
})

container.register(GetThreadWithCommentsUseCase, {
  useFactory: (c) => new GetThreadWithCommentsUseCase(
    c.resolve(t.ThreadsRepository), c.resolve(t.CommentsRepository), c.resolve(t.deletedCommentContentMask)
  )
})

container.register(GetThreadWithCommentsAndRepliesUseCase, {
  useFactory: (c) => new GetThreadWithCommentsAndRepliesUseCase(
    c.resolve(t.ThreadsRepository),
    c.resolve(t.CommentsRepository),
    c.resolve(t.ReplyRepository),
    c.resolve(t.deletedCommentContentMask),
    c.resolve(t.deletedReplyContentMask)
  )
})

container.register(AddReplyUseCase, {
  useFactory: (c) => new AddReplyUseCase(
    c.resolve(t.ThreadsRepository),
    c.resolve(t.CommentsRepository),
    c.resolve(t.ReplyRepository)
  )
})

container.register(DeleteReplyUseCase, {
  useFactory: (c) => new DeleteReplyUseCase(
    c.resolve(t.ThreadsRepository),
    c.resolve(t.CommentsRepository),
    c.resolve(t.ReplyRepository)
  )
})

container.register(ToggleCommentLikeUseCase, {
  useFactory: (c) => new ToggleCommentLikeUseCase(
    c.resolve(t.ThreadsRepository),
    c.resolve(t.CommentsRepository),
    c.resolve(t.CommentLikeRepository)
  )
})

export default container as IocContainer
