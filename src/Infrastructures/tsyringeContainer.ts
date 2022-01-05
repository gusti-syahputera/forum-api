/* istanbul ignore file */

import { container } from 'tsyringe'

import IocContainer from '../Commons/IocContainer'

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

import DeleteAuthenticationUseCase from '../Applications/use_case/DeleteAuthenticationUseCase'
import AddUserUseCase from '../Applications/use_case/AddUserUseCase'
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase'
import LogoutUserUseCase from '../Applications/use_case/LogoutUserUseCase'
import RefreshAuthenticationUseCase from '../Applications/use_case/RefreshAuthenticationUseCase'

/* eslint-disable symbol-description */
export const tokens = {
  pool: Symbol(),
  idGenerator: Symbol(),
  bcrypt: Symbol(),
  saltRound: Symbol(),
  jwt: Symbol(),
  UserRepository: Symbol(),
  PasswordHash: Symbol(),
  AuthenticationRepository: Symbol(),
  AuthenticationTokenManager: Symbol()
}
/* eslint-enable symbol-description */
const t = tokens

/* Registering dependencies of services */

container.register(t.pool, { useValue: pool })
container.register(t.idGenerator, { useValue: nanoid })
container.register(t.bcrypt, { useValue: bcrypt })
container.register(t.saltRound, { useValue: 10 })
container.register(t.jwt, { useValue: Jwt.token })

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

container.register(DeleteAuthenticationUseCase, {
  useFactory: (c) => new DeleteAuthenticationUseCase(c.resolve(t.AuthenticationRepository))
})

const container_: IocContainer = container
export default container_
