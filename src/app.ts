import 'reflect-metadata'

import * as dotenv from 'dotenv'
import { Server } from '@hapi/hapi'

import createServer from './Infrastructures/http/createServer'
import container from './Infrastructures/tsyringeContainer'
import ResponseRenderer from './Interfaces/http/ResponseRenderer'

dotenv.config()

const start = async (): Promise<Server> => {
  const renderer = new ResponseRenderer('terjadi kegagalan pada server kami')
  const server = await createServer(container, renderer)
  await server.start()
  return server
}

void start().then((server) => {
  console.log(`server start at ${server.info.uri}`)
})
