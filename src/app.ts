import 'reflect-metadata'

import * as dotenv from 'dotenv'
import { Server } from '@hapi/hapi'

import createServer from './Infrastructures/http/createServer'
import container from './Infrastructures/tsyringeContainer'

dotenv.config()

const start = async (): Promise<Server> => {
  const server = await createServer(container)
  await server.start()
  return server
}

void start().then((server) => {
  console.log(`server start at ${server.info.uri}`)
})
