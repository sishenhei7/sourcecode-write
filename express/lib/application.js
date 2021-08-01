import http from 'http'
import methods from 'methods'
import finalhandler from 'finalhandler'
import setPrototypeOf from 'setprototypeof'
import Router from './router.js'

export default class App {
  constructor() {
    this.router = new Router()
    this.appendMethods()
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

    fns.forEach(() => {

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
