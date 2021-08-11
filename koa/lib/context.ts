import { IncomingMessage, ServerResponse } from 'http'
import Application from './application'
import { Request } from './request'
import { Response } from './response'

export interface Context {
  request: Request
  response: Response

  app: Application
  req: IncomingMessage
  res: ServerResponse

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
