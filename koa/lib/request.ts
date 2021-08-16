import net from 'net'
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

  // request delegation
  querystring?: string
  idempotent?: string
  socket?: net.Socket
  search?: string
  method?: string
  query?: string
  path?: string
  url?: string
  accept?: string[]
  origin?: string
  href?: string
  subdomains?: string
  protocol?: string
  host?: string
  hostname?: string
  URL?: string
  header?: string
  headers?: string[]
  secure?: boolean
  stale?: boolean
  fresh?: boolean
  ips?: boolean
  ip?: string

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

  is() {
    // TODO
    console.log('is')
  }

  get() {
    // TODO
    console.log('get')
  }

  accepts() {
    // TODO
    console.log('accepts')
  }

  acceptsCharsets() {
    // TODO
    console.log('acceptsCharsets')
  }

  acceptsEncodings() {
    // TODO
    console.log('acceptsEncodings')
  }

  acceptsLanguages() {
    // TODO
    console.log('acceptsLanguages')
  }
}
