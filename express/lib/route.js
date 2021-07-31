import methods from 'methods'
import Layer from './layer.js'

export default class Route {
  constructor(path) {
    this.path = path
    this.stack = []
    this.appendMethods()
  }

  dispatch(req, res, done) {
    let idx = 0
    const { stack } = this
    const method = req.method.toLowerCase()

    if (stack.length === 0) {
      done()
    }

    req.route = this
    next()

    function next(err) {
      const layer = stack[idx++]
      if (!layer) {
        done(err)
      }

      // 如果 method 是undefined，会继续向下运行
      if (layer.method && layer.method !== method) {
        next(err)
      }

      if (err) {
        layer.handleError(err, req, res, next)
      } else {
        layer.handleRequest(req, res, next)
      }
    }
  }

  all(...fns) {
    fns.forEach((handle) => {
      const layer = new Layer('/', {}, handle)
      layer.method = undefined
      this.stack.push(layer)
    })
  }

  appendMethods() {
    methods.concat('all').forEach((method) => {
      this[method] = function(...fns) {
        fns.forEach((handle) => {
          // 因为route这层处理的是method，所以path都是斜杠
          const layer = new Layer('/', {}, handle)
          layer.method = method
          this.stack.push(layer)
        })
      }
    })
  }
}
