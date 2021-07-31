import methods from 'methods'
import Route from './route.js'
import Layer from './layer.js'
import { consoleAll, getPathname } from './utils.js'

export default class Router {
  constructor() {
    this.stack = []
    this.appendMethods()
  }

  handle(req, res, done) {
    let idx = 0
    const { stack } = this
    const { url, params, originalUrl, baseUrl, method } = req
    consoleAll({ url, params, originalUrl, baseUrl, method })

    req.next = done
    req.baseUrl = baseUrl || ''
    req.originalUrl = originalUrl || url

    next()

    function next(err) {
      if (idx >= stack.length) {
        setImmediate(done, err)
      }

      const path = getPathname(req)
      if (path == null) {
        done(err)
      }

      let layer, match, route
      while (match !== true && idx < stack.length) {
        layer = stack[idx++]
        match = layer.match(path)
        route = layer.route

        if (!match) {
          continue
        }

        if (!route) {
          continue
        }

        if (err) {
          match = false
          contiue
        }
        // TODO: 增加对option和head的处理
        // const { method } = req
      }

      if (!match) {
        return done(err)
      }

      if (route) {
        req.route = route
      }

      req.params = layer.params

      if (err) {
        layer.handleError(err, req, res, next);
      } else {
        layer.handleRequest(req, res, next);
      }

      // TODO: 对 params 及 paramcalled 的处理
      // processParams
    }
  }

  route(path) {
    const route = new Route(path)
    const layer = new Layer(path, {}, route.dispatch.bind(route))
    layer.route = route
    this.stack.push(layer)
    return route
  }

  // processParams(layer, paramCalled, req, res, done) {

  // }

  appendMethods() {
    methods.concat('all').forEach((method) => {
      this[method] = function(path, ...args) {
        const route = this.route(path)
        route[method](...args)
        return this
      }
    })
  }
}

// function trimPrefix () {

// }
