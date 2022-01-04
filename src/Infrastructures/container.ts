/* istanbul ignore file */
import 'reflect-metadata'

import { container } from 'tsyringe'

// External dependencies
import { nanoid } from 'nanoid'
import * as bcrypt from 'bcrypt'
import { token as Jwt } from '@hapi/jwt'
import pool from './database/postgres/pool'

// Service (repository, helper, manager, etc)
import UserRepositoryPostgres from './repository/UserRepositoryPostgres'
import BcryptPasswordHash from './security/BcryptPasswordHash'
import JwtTokenManager from './security/JwtTokenManager'
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres'

/* Registering dependencies of services */

// Repositories
container.register('pool', { useValue: pool })
container.register('idGenerator', { useValue: nanoid })

// BcryptPasswordHash
container.register('bcrypt', { useValue: bcrypt })
container.register('saltRound', { useValue: 10 })

// JwtTokenManager
container.register('jwt', { useValue: Jwt })

/* Registering dependencies of UseCases */

container.register('userRepository', { useClass: UserRepositoryPostgres })
container.register('passwordHash', { useClass: BcryptPasswordHash })
container.register('authenticationRepository', { useClass: AuthenticationRepositoryPostgres })
container.register('authenticationTokenManager', { useClass: JwtTokenManager })

export default container
