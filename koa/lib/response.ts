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

  length: number

  _explicitNullBody: boolean

  has: (type: string) => boolean
  remove: (type: string) => void
}

export default {
  has(type: string) {
    // TODO
    console.log(type)
  },

  remove(type: string) {
    // TODO
    console.log(type)
  },
}
