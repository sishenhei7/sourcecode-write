import http from 'http'
import methods from 'methods'
import finalhandler from 'finalhandler'
import Router from './router.js'
import Request from './request.js'
import Response from './response.js'
import middlewareInit from './middleware/init.js'
import middlewareQuery from './middleware/query.js'

export default class App {
  constructor() {
    this.router = new Router()

    this.request = Object.defineProperty(new Request(), 'app', {
      value: this,
      configurable: true,
      enumerable: true,
      writable: true,
    })
    this.response = Object.defineProperty(new Response(), 'app', {
      value: this,
      configurable: true,
      enumerable: true,
      writable: true,
    })

    this.appendMethods()
    this.use(middlewareInit(this))
    this.use(middlewareQuery)
  }

  listen(...args) {
    const server = http.createServer(this.handle.bind(this))
    return server.listen(...args)
  }

  handle(req, res, callback) {
    const done = callback || finalhandler(req, res)
    this.router.handle(req, res, done)
  }

  use(path, ...fns) {
    // 默认 path 为 '/'
    if (typeof path === 'function') {
      fns.shift(path)
      path = '/'
    }

    const { router } = this
    fns.forEach((fn) => {
      router.use(path, fn)
    })
  }

  appendMethods() {
    methods.concat('all').forEach((method) => {
      this[method] = function(args) {
        this.router[method](args)
        return this
      }
    })
  }
}
