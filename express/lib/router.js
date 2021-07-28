import methods from 'methods'
import Route from './route.js'
import { consoleAll } from './utils.js'

export default class Router {
  constructor() {
    this.stack = []
    this.appendMethods()
  }

  handle(req, res, next) {
    const { url, params, baseUrl, method } = req
    consoleAll({ url, params, baseUrl, method })
  }

  next() {

  }

  route(path) {
    const route = new Route(path)
    return route
  }

  appendMethods() {
    methods.concat('all').forEach((method) => {
      this[method] = function(path, ...args) {
        const route = this.route(path)
        route[method](...args)
      }
    })
  }
}
