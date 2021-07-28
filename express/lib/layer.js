import pathRegexp from 'path-to-regexp'

export default class Layer {
  constructor(path, options, fn) {
    this.path = path
    this.regexp = pathRegexp(path, [], options || {})
    this.handle = fn
  }


}