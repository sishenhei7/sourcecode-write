import util from 'util'
import { Buffer } from 'buffer'
import { IncomingMessage, ServerResponse } from 'http'

import httpAssert from 'http-assert'
import createError from 'http-errors'
import delegate from 'delegates'
import statuses from 'statuses'

import Application from './application'
import Request from './request'
import Response from './response'

const toString = Object.prototype.toString

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

  // request delegation
  querystring?: Request['querystring']
  idempotent?: Request['idempotent']
  socket?: Request['socket']
  search?: Request['search']
  method?: Request['method']
  query?: Request['query']
  path?: Request['path']
  url?: Request['url']
  accept?: Request['accept']
  origin?: Request['origin']
  href?: Request['href']
  subdomains?: Request['subdomains']
  protocol?: Request['protocol']
  host?: Request['host']
  hostname?: Request['hostname']
  URL?: Request['URL']
  header?: Request['header']
  headers?: Request['headers']
  secure?: Request['secure']
  stale?: Request['stale']
  fresh?: Request['fresh']
  ips?: Request['ips']
  ip?: Request['ip']
  acceptsLanguages?: Request['acceptsLanguages']
  acceptsEncodings?: Request['acceptsEncodings']
  acceptsCharsets?: Request['acceptsCharsets']
  accepts?: Request['accepts']
  get?: Request['get']
  is?: Request['is']

  // response delegation
  status?: Response['status']
  message?: Response['message']
  body?: Response['body']
  length?: Response['length']
  type?: Response['type']
  lastModified?: Response['lastModified']
  etag?: Response['etag']
  writable?: Response['writable']
  headerSent?: Response['headerSent']
  attachment?: Response['attachment']
  redirect?: Response['redirect']
  remove?: Response['remove']
  vary?: Response['vary']
  has?: Response['has']
  set?: Response['set']
  append?: Response['append']
  flushHeaders?: Response['flushHeaders']

  // self
  state = {}
  originalUrl = ''
  respond = true

  /**
   * Context Constructor
   * delegate request and response
   */
  constructor() {
    delegate(this, 'request')
      .method('acceptsLanguages')
      .method('acceptsEncodings')
      .method('acceptsCharsets')
      .method('accepts')
      .method('get')
      .method('is')
      .access('querystring')
      .access('idempotent')
      .access('socket')
      .access('search')
      .access('method')
      .access('query')
      .access('path')
      .access('url')
      .access('accept')
      .getter('origin')
      .getter('href')
      .getter('subdomains')
      .getter('protocol')
      .getter('host')
      .getter('hostname')
      .getter('URL')
      .getter('header')
      .getter('headers')
      .getter('secure')
      .getter('stale')
      .getter('fresh')
      .getter('ips')
      .getter('ip')

    delegate(this, 'response')
      .method('attachment')
      .method('redirect')
      .method('remove')
      .method('vary')
      .method('has')
      .method('set')
      .method('append')
      .method('flushHeaders')
      .access('status')
      .access('message')
      .access('body')
      .access('length')
      .access('type')
      .access('lastModified')
      .access('etag')
      .getter('headerSent')
      .getter('writable')
  }

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

  /**
   * Alias for inspect implementation
   * @public
   */
  get [util.inspect.custom]() {
    return this.inspect()
  }

  /**
   * Assert with status code
   * @public
   *
   * @param value - 判断的值，如果值为 false，则发出 httpError
   * @param status - httpError 的 code
   * @param msg - httpError 的 msg
   * @param opt - httpError 的其它选项
   */
  assert = httpAssert

  /**
   * Throw http errors
   * @public
   *
   * @remark 为什么throw有自动type，但是assert没有呢？
   */
  throw = createError

  /**
   * Context 的 error 处理函数
   * @public
   *
   * @param err - Error
   */
  onerror(err: Record<string, any>): void {
    if (err == null) {
      return
    }

    const isNativeError = toString.call(err) === '[object Error]' || err instanceof Error
    if (isNativeError) {
      throw new Error(util.format('non-error thrown: %j', err))
    }

    // what is headerSent mean here?
    let headerSent = false
    if (this.headerSent && this.writable) {
      headerSent = err.headerSent = true
    }

    this.app?.emit('error', err, this)

    if (headerSent) {
      return
    }

    const { res } = this as Required<Context>

    if (typeof res.getHeaderNames === 'function') {
      res.getHeaderNames().forEach(name => res.removeHeader(name))
    } else {
      res._headers = {} // Node < 7.7
    }

    this.set!(err.headers)
    this.type = 'text'

    let statusCode = err.status || err.statusCode

    // ENOENT support
    if (err.code === 'ENOENT') {
      statusCode = 404
    }

    // default to 500
    if (typeof statusCode !== 'number' || !statuses(statusCode)) {
      statusCode = 500
    }

    // respond
    const code = statuses(statusCode)
    const msg = err.expose ? err.message : code
    this.status = err.status = statusCode
    this.length = Buffer.byteLength(msg)
    res.end(msg)
  }
}

// /**
//  * Request Delegation
//  */
// delegate(Context.prototype, 'request')
//   .method('acceptsLanguages')
//   .method('acceptsEncodings')
//   .method('acceptsCharsets')
//   .method('accepts')
//   .method('get')
//   .method('is')
//   .access('querystring')
//   .access('idempotent')
//   .access('socket')
//   .access('search')
//   .access('method')
//   .access('query')
//   .access('path')
//   .access('url')
//   .access('accept')
//   .getter('origin')
//   .getter('href')
//   .getter('subdomains')
//   .getter('protocol')
//   .getter('host')
//   .getter('hostname')
//   .getter('URL')
//   .getter('header')
//   .getter('headers')
//   .getter('secure')
//   .getter('stale')
//   .getter('fresh')
//   .getter('ips')
//   .getter('ip')

// /**
//  * Response Delegation
//  */
// delegate(Context.prototype, 'response')
//   .method('attachment')
//   .method('redirect')
//   .method('remove')
//   .method('vary')
//   .method('has')
//   .method('set')
//   .method('append')
//   .method('flushHeaders')
//   .access('status')
//   .access('message')
//   .access('body')
//   .access('length')
//   .access('type')
//   .access('lastModified')
//   .access('etag')
//   .getter('headerSent')
//   .getter('writable')
