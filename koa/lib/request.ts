import { IncomingMessage, ServerResponse } from 'http'
import Application from './application'
import Context from './context'
import Response from './response'
import { only } from './utils'

export default class Request {
  app?: Application
  req?: IncomingMessage
  res?: ServerResponse
  ctx?: Context

  response?: Response
  originalUrl?: string

  /**
   * Return JSON representation for settings
   * @public
   */
  toJSON(): Partial<Request> {
    return only(this, ['method', 'url', 'header'])
  }

  /**
   * inspect implementation
   * @public
   */
  inspect(): Partial<Context> {
    return this.toJSON()
  }
}
