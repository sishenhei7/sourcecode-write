import { IncomingMessage, ServerResponse } from 'http'

import Application from './application'
import Request from './request'
import Response from './response'

/**
 * Context class
 * @public
 */
export default class Context {
  req?: IncomingMessage
  res?: ServerResponse

  app?: Application
  request?: Request
  response?: Response

  body?: any
  type?: string
  status?: number
  method?: string
  length?: number
  message?: string
  state?: Record<string, unknown>

  originalUrl?: string
  respond?: boolean
  writable?: boolean

  /**
   * Return JSON representation for settings
   * @public
   */
  toJSON(): Record<string, unknown> {
    return {
      request: this.request!.toJSON(),
      response: this.response!.toJSON(),
      app: this.app!.toJSON(),
      originalUrl: this.originalUrl,
      req: '<original node req>',
      res: '<original node res>',
      socket: '<original node socket>',
    }
  }

  /**
   * inspect implementation
   * @public
   */
  inspect(): Partial<Context> {
    return this.toJSON()
  }

  onerror(err: Error | null) {
    // TODO: onerror
    console.log(err)
  }
}
