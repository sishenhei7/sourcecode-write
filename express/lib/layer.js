import pathRegexp from 'path-to-regexp'
import { decodeParam } from './utils.js'

export default class Layer {
  constructor(path, options, fn) {
    this.params = undefined
    this.path = undefined
    this.handle = fn
    this.regexp = pathRegexp(path, [], options || {})

    this.isRegexpStar = path === '*'
    this.isRegexpSlash = path === '/'
  }

  // layer 主要做的就是这个 match 的工作
  match(path) {
    let match

    if (path != null) {
      if (this.isRegexpStar) {
        this.params = {'0': decodeParam(path)}
        this.path = path
        return true
      }

      if (this.isRegexpSlash) {
        this.params = {}
        this.path = ''
        return true
      }

      match = this.regexp.exec(path)
    }

    if (!match) {
      this.params = undefined
      this.path = undefined
      return false
    }

    // TODO: 解析params
  }

  handleRequest(req, res, next) {
    const { handle } = this

    try {
      handle(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  handleError(err, req, res, next) {
    const { handle } = this

    try {
      handle(err, req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

