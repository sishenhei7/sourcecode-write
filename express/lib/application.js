import http from 'http'
import methods from 'methods'
import createDebug from 'debug'
import finalhandler from 'finalhandler'
import Router from './router.js'
import Request from './request.js'
import Response from './response.js'
import middlewareInit from './middleware/init.js'
import middlewareQuery from './middleware/query.js'
import { generateEtag } from './utils.js'

const debug = createDebug('express:application')

export default class App {
  constructor() {
    this.settings = new Map()
    this.router = new Router()
    this.request = Object.defineProperty(Request.prototype, 'app', {
      value: this,
      configurable: true,
      enumerable: true,
      writable: true,
    })
    this.response = Object.defineProperty(Response.prototype, 'app', {
      value: this,
      configurable: true,
      enumerable: true,
      writable: true,
    })

    this.setDefaultSettings()
    this.appendMethods()
    this.use(middlewareInit(this))
    this.use(middlewareQuery)
  }

  set(name, val) {
    this.settings.set(name, val)
    return this
  }

  setDefaultSettings() {
    const env = process.env.NODE_ENV || 'development'
    this.set('etag fn', generateEtag)
    this.set('env', env)
    this.set('jsonp callback name', 'callback')
  }

  listen(...args) {
    debug('listen')
    const server = http.createServer(this.handle.bind(this))
    return server.listen(...args)
  }

  handle(req, res, callback) {
    debug('req + res', req.method + ' ' + req.url)
    const done = callback || finalhandler(req, res)
    this.router.handle(req, res, done)
  }

  use(path, ...fns) {
    // 默认 path 为 '/'
    if (typeof path === 'function') {
      fns.unshift(path)
      path = '/'
    }

    const { router } = this
    fns.forEach((fn) => {
      router.use(path, fn)
    })
  }

  appendMethods() {
    methods.concat('all').forEach((method) => {
      this[method] = function(...args) {
        // implement get
        if (method === 'get' && args.length === 1) {
          return this.settings.get(...args)
        }

        this.router[method](...args)
        return this
      }
    })
  }
}
