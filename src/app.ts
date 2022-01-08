import 'reflect-metadata'

import * as dotenv from 'dotenv'

import createServer from './Infrastructures/http/createServer'
import container from './Infrastructures/tsyringeContainer'

const start = async (): Promise<void> => {
  const server = await createServer(container)
  await server.start()
  console.log(`server start at ${server.info.uri}`)
}

dotenv.config()
void start()
