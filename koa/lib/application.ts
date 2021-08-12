import http, { Server, IncomingMessage, ServerResponse, RequestListener } from 'http'
import Emmiter from 'events'
import { Stream } from 'stream'
import { Buffer } from 'buffer'
import util from 'util'

import Debug from 'debug'
import statuses from 'statuses'
import onfinished from 'on-finished'
import compose, { ComposedMiddleware } from 'koa-compose'

import context, { Context } from './context'
import request, { Request } from './request'
import response, { Response } from './response'
import { only } from './utils'

/**
 * 中间件函数
 *
 * @param ctx - context
 */
export type middlewareFn = (ctx: Context) => Promise<unknown>

/**
 * Application 的 option 数据
 *
 * @param env - Environment, default to 'development'
 * @param keys - signed cookie keys
 * @param silent - whether to silent errors
 * @param proxy - whether to proxy
 * @param proxyIpHeader - proxy headers, default to 'X-Forwarded-For'
 * @param maxIpsCount - proxy ip couts, default to 0
 */
export interface ApplicationOptions {
  env?: string
  keys?: string[]
  silent?: boolean
  proxy?: boolean
  proxyIpHeader?: string
  maxIpsCount?: number
}

const debug = Debug('koa:application')
const toString = Object.prototype.toString

/**
 * Application class
 * @public
 *
 * @remarks
 * inherits from Emmiter
 */
export default class Application extends Emmiter {
  private _middleware: middlewareFn[] = []

  public readonly context: Context
  public readonly request: Request
  public readonly response: Response
  public readonly env: string
  public readonly keys?: string[]
  public readonly silent: boolean
  public readonly proxy: boolean
  public readonly proxyIpHeader: string
  public readonly maxIpsCount: number

  constructor(options?: ApplicationOptions) {
    super()
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)

    const { env, keys, silent, proxy, proxyIpHeader, maxIpsCount } = options || {}
    this.env = env || process.env.NODE_ENV || 'development'
    this.keys = keys
    this.silent = !!silent
    this.proxy = !!proxy
    this.proxyIpHeader = proxyIpHeader || 'X-Forwarded-For'
    this.maxIpsCount = maxIpsCount || 0
  }

  /**
   * Return JSON representation for settings
   * @public
   *
   * @return settings
   */
  toJSON(): Partial<Application> {
    return only(this, ['env', 'silent', 'proxy', 'proxyIpHeader', 'maxIpsCount'])
  }

  /**
   * inspect implementation
   * @public
   *
   * @return settings
   */
  inspect(): Partial<Application> {
    return this.toJSON()
  }

  /**
   * Use the given middleware
   * @public
   *
   * @param fn - middleware
   * @return application
   */
  use(fn: middlewareFn): Application {
    debug('use middleware %s', fn.name || '-')
    this._middleware.push(fn)
    return this
  }

  /**
   * Shorthand for:
   * http.createServer(app.callback()).listen(...)
   * @puclic
   *
   * @param args - any
   * @return server
   */
  listen(...args: any): Server {
    debug('listen')
    const server = http.createServer(this.requestListener)
    return server.listen(...args)
  }

  /**
   * requestListener for http.createServer
   * @private
   */
  private requestListener(): RequestListener {
    const fns = compose<Context>(this._middleware)

    if (!this.listenerCount('error')) {
      this.on('error', this.onerror)
    }

    const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fns)
    }

    return handleRequest
  }

  /**
   * Create a context
   * @private
   *
   * @param req - IncomingMessage
   * @param res - ServerResponse
   * @return context
   */
  private createContext(req: IncomingMessage, res: ServerResponse): Context {
    const context = Object.create(this.context)
    const request = (context.request = Object.create(this.request))
    const response = (context.response = Object.create(this.response))
    context.app = request.app = response.app = this
    context.req = request.req = response.req = req
    context.res = request.res = response.res = res
    request.ctx = response.ctx = context
    request.response = response
    response.request = request
    context.originalUrl = request.originalUrl = req.url
    context.state = {}
    return context
  }

  /**
   * Async function to handle Request
   * @private
   *
   * @param ctx - application context
   * @param fnsMiddleware - composed middleware
   * @return Promise
   */
  private async handleRequest(
    ctx: Context,
    fnsMiddleware: ComposedMiddleware<Context>,
  ): Promise<ServerResponse | void> {
    const { res } = ctx
    const onerror = (err: Error | null) => ctx.onerror(err)

    res.statusCode = 404
    onfinished(res, onerror)

    try {
      await fnsMiddleware(ctx)
      return this.respond(ctx)
    } catch (err) {
      return onerror(err)
    }
  }

  /**
   * Create server response
   * core for middlewares
   * @private
   *
   * @param ctx - context
   * @return ServerResponse | void
   */
  private respond(ctx: Context): ServerResponse | void {
    const { response, res, req, status, method, respond, writable } = ctx
    let { body } = ctx

    if (respond === false || !writable) return

    if (statuses.empty[status]) {
      ctx.body = null
      return res.end()
    }

    if (method === 'HEAD') {
      if (!res.headersSent && response.has('Content-Length')) {
        const { length } = response
        if (Number.isInteger(length)) {
          ctx.length = length
        }
      }
      return res.end()
    }

    if (body == null) {
      if (response._explicitNullBody) {
        response.remove('Content-Type')
        response.remove('Transfer-Encoding')
        return res.end()
      }

      body = req.httpVersionMajor >= 2 ? String(status) : ctx.message || String(status)
      if (!res.headersSent) {
        ctx.type = 'text'
        ctx.length = Buffer.byteLength(body)
      }
      res.end(body)
    }

    if (Buffer.isBuffer(body) || typeof body === 'string') {
      return res.end(body)
    }

    if (body instanceof Stream) {
      return body.pipe(res)
    }

    body = JSON.stringify(body)
    if (!res.headersSent) {
      ctx.length = Buffer.byteLength(body)
    }
    res.end(body)
  }

  /**
   * Application error function
   * @param err - Error
   * @return void
   */
  private onerror<T extends Record<string, unknown>>(err: T): void {
    const isNativeError = toString.call(err) === '[object Error]' || err instanceof Error
    if (isNativeError) {
      throw new Error(util.format('non-error thrown: %j', err))
    }

    if (err.status === 404 || err.expose || this.silent) {
      return
    }

    const msg = err.stack || err.toString()
    console.error(`\n${(msg as string).replace(/^/gm, '  ')}\n`)
  }
}
