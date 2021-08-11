import http, { Server, IncomingMessage, ServerResponse, RequestListener } from 'http'
import Emmiter from 'events'
import Debug from 'debug'
import { Stream } from 'stream'
import { Buffer } from 'buffer'
import statuses from 'statuses'
import onfinished from 'on-finished'
import compose, { ComposedMiddleware } from 'koa-compose'

import context, { Context } from './context'
import request, { Request } from './request'
import response, { Response } from './response'
import { only } from './utils'

export type middlewareFn = (...args: any[]) => void

export interface ApplicationOptions {
  env?: string
  maxIpsCount?: number
  keys?: string[]
}

const debug = Debug('koa:application')

export default class Application extends Emmiter {
  private _middleware: middlewareFn[] = []

  public readonly context: Context
  public readonly request: Request
  public readonly response: Response
  public readonly env: string
  public readonly maxIpsCount: number
  public readonly keys?: string[]

  constructor(options: ApplicationOptions) {
    super()
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)

    const { env, maxIpsCount, keys } = options
    this.env = env || process.env.NODE_ENV || 'development'
    this.maxIpsCount = maxIpsCount || 0
    this.keys = keys
  }

  toJSON() {
    return only(this, ['env'])
  }

  use(fn: middlewareFn): Application {
    debug('use middleware %s', fn.name || '-')
    this._middleware.push(fn)
    return this
  }

  listen(...args: any): Server {
    debug('listen')
    const server = http.createServer(this.requestListener)
    return server.listen(...args)
  }

  requestListener(): RequestListener {
    const fns = compose(this._middleware)

    if (!this.listenerCount('error')) {
      this.on('error', this.onerror)
    }

    const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fns)
    }

    return handleRequest
  }

  createContext(req: IncomingMessage, res: ServerResponse): Context {
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

  async handleRequest(ctx: Context, fnsMiddleware: ComposedMiddleware<Context>): Promise<ServerResponse | void> {
    const res = ctx.res
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

  // 中间件的核心原理
  respond(ctx: Context) {
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

  onerror() {
    // TODO: onerror
    console.log('onerror')
  }
}
