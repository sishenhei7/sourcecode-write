import pathRegexp from 'path-to-regexp'
import { decodeParam } from './utils.js'

export default class Layer {
  constructor(path, options, fn) {
    this.keys = []
    this.params = undefined
    this.path = undefined
    this.handle = fn
    this.regexp = pathRegexp.pathToRegexp(path, this.keys, options || {})

    this.isRegexpStar = path === '*'
    this.isRegexpSlash = path === '/'
  }

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

    this.params = {}
    this.path = match[0]

    const { params, keys } = this
    for (let i = 1; i < params.length; i += 1) {
      const key = keys[i - 1]
      const prop = key.name
      const val = decodeParam(match[i])

      if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
        params[prop] = val
      }
    }

    return true
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

