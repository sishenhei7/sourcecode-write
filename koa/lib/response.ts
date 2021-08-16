import Buffer from 'buffer'
import Stream from 'stream'
import { IncomingMessage, ServerResponse } from 'http'

import Application from './application'
import Context from './context'
import Request from './request'
import { only } from './utils'

export type responseBody = null | string | Record<string, unknown> | Buffer | Stream

export default class Response {
  app?: Application
  req?: IncomingMessage
  res?: ServerResponse
  ctx?: Context
  request?: Request

  status?: number
  message?: string
  length?: number
  type?: string
  lastModified?: string
  etag?: string
  writable?: boolean
  headerSent?: boolean

  _explicitNullBody?: boolean
  _body?: responseBody

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

  get body() {
    return this._body
  }

  has(type: string) {
    // TODO
    console.log(type)
  }

  remove(type: string) {
    // TODO
    console.log(type)
  }

  attachment() {
    // TODO
    console.log('attachment')
  }

  redirect() {
    // TODO
    console.log('redirect')
  }

  vary() {
    // TODO
    console.log('vary')
  }

  set(headers: string[]) {
    // TODO
    console.log(headers)
  }

  append() {
    // TODO
    console.log('append')
  }

  flushHeaders() {
    // TODO
    console.log('flushHeaders')
  }
}
