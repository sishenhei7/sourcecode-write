import methods from 'methods'
import Layer from './layer.js'

export default class Route {
  constructor(path) {
    this.path = path
    this.stack = []
    this.methods = Object.create(null)
    this.appendMethods()
  }

  dispatch(req, res, done) {
    const idx = 0
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

  appendMethods() {
    methods.concat('all').forEach((method) => {
      this[method] = function(path, ...args) {
        args.forEach((handle) => {
          const layer = new Layer(path, {}, handle)
          layer.method = method
          this.methods[method] = true
          this.stack.push(layer)
        })
      }
    })
  }
}
