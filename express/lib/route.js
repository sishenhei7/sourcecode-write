import methods from 'methods'
import Layer from './layer.js'

export default class Route {
  constructor(path) {
    this.path = path
    this.stack = []
    this.methods = Object.create(null)
    this.appendMethods()
  }

  dispatch(req, res, next) {

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
