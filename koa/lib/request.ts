import { IncomingMessage, ServerResponse } from 'http'
import Application from './application'
import { Context } from './context'
import { Response } from './response'

export interface Request {
  app: Application
  req: IncomingMessage
  res: ServerResponse
  ctx: Context

  response: Response
  originalUrl: string
}

export default {}
