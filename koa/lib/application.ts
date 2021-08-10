import http, { Server, IncomingMessage, ServerResponse, RequestListener } from 'http'
import Emmiter from 'events'
import Debug from 'debug'
import onfinished from 'on-finished'
import compose, { ComposedMiddleware } from 'koa-compose'
import context, { Context } from './context'
import request, { Request } from './request'
import response, { Response } from './response'

export type middlewareFn = (...args: any[]) => void

const debug = Debug('koa:application')

export default class Application extends Emmiter {
  private _middleware: middlewareFn[] = []

  public context: Context
  public readonly request: Request
  public readonly response: Response

  constructor() {
    super()
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
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

  async handleRequest(ctx: Context, fnsMiddleware: ComposedMiddleware<Context>): Promise<void> {
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
    // TODO: respond
    console.log(ctx)
  }

  onerror() {
    // TODO: onerror
    console.log(onerror)
  }
}
