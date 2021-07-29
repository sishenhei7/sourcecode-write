import methods from 'methods'
import Route from './route.js'
import Layer from './layer.js'
import { consoleAll, getPathname } from './utils.js'

export default class Router {
  constructor() {
    this.stack = []
    this.appendMethods()
  }

  handle(req, res, next) {
    const idx = 0
    const { stack } = this
    const { url, params, baseUrl, method } = req
    consoleAll({ url, params, originalUrl, baseUrl, method })

    req.next = next
    req.baseUrl = baseUrl || ''
    req.originalUrl = originalUrl || url

    next()

    function next(err) {
      if (idx >= stack.length) {
        setImmediate(next, err)
      }

      const path = getPathname(req)
      if (path == null) {
        next(err)
      }

      let layer, match, route
      while (match !== true && idx < stack.length) {
        layer = match[idx++]
        match = matchLayer(layer, path)

        // TODO: 继续next
      }
    }
  }

  route(path) {
    const route = new Route(path)
    const layer = new Layer(path, {}, route.dispatch.bind(route))
    layer.route = route
    this.stack.push(layer)
    return route
  }

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
