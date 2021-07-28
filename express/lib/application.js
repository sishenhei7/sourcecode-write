import http from 'http'
import finalhandler from 'finalhandler'
import Router from './router.js'

export default class App {
  constructor() {
    this.router = new Router()
  }

  listen(...args) {
    const server = http.createServer(this.handle.bind(this))
    return server.listen(...args)
  }

  handle(req, res, callback) {
    const done = callback || finalhandler(req, res)
    this.router.handle(req, res, done)
  }
}
