import { IncomingMessage, ServerResponse } from 'http'
import Application from './application'
import Context from './context'
import Request from './request'
import { only } from './utils'

export default class Response {
  app?: Application
  req?: IncomingMessage
  res?: ServerResponse
  ctx?: Context
  request?: Request

  length?: number

  _explicitNullBody?: boolean

  /**
   * Return JSON representation for settings
   * @public
   */
  toJSON(): Partial<Request> {
    return only(this, ['status', 'message', 'header'])
  }

  /**
   * inspect implementation
   * @public
   */
  inspect(): Partial<Context> {
    return this.toJSON()
  }

  has(type: string) {
    // TODO
    console.log(type)
  }

  remove(type: string) {
    // TODO
    console.log(type)
  }
}
