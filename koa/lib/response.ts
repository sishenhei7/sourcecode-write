import { IncomingMessage, ServerResponse } from 'http'
import Application from './application'
import { Context } from './context'
import { Request } from './request'

export interface Response {
  app: Application
  req: IncomingMessage
  res: ServerResponse
  ctx: Context
  request: Request
}

export default {}
