import { IncomingMessage, ServerResponse } from 'http'
import Application from './application'
import { Request } from './request'
import { Response } from './response'

/**
 * 上下文
 * @public
 */
export interface Context {
  req: IncomingMessage
  res: ServerResponse

  app: Application
  request: Request
  response: Response

  body: any
  type: string
  status: number
  method: string
  length: number
  message: string
  state: Record<string, unknown>

  originalUrl: string
  respond: boolean
  writable: boolean

  onerror: (err: Error | null) => void
}

export default {
  onerror(err: Error | null) {
    // TODO: onerror
    console.log(err)
  },
}
