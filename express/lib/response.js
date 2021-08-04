import http from 'http'
import send from 'send'
import { setCharset } from './utils.js'

const mime = send.mime
const charsetRegExp = /;\s*charset\s*=/

export default class Response extends http.ServerResponse {
  status(code) {
    this.statusCode = code
    return this
  }

  // setHeaders
  set(name, val) {
    const nameType = typeof name

    if (nameType === 'string') {
      const value = Array.isArray(val) ? val.map(String) : String(val)

      if (name.toLowerCase() === 'content-type' && charsetRegExp.test(value)) {
        const charset = mime.charsets.lookup(value.split(';')[0])
        if (charset) value += '; charset =' + charset.toLowerCase()
      }

      this.setHeader(name, value)
    } else if (nameType === 'object') {
      for (key in name) {
        this.set(key, name[key])
      }
    }

    return this
  }

  get(name) {
    this.getHeader(name)
  }

  type(type) {
    const mimeType = type.includes('/') ? type : mime.lookup(type)
    this.set('content-type', mimeType)
  }

  send(body) {
    switch(typeof body) {
      case 'string':
        if (!this.get('Content-Type')) {
          this.type('html')
        }
        break
      case 'boolean':
      case 'number':
      case 'object':
        if (body == null) {
          body = ''
        } else if (Buffer.isBuffer(body)) {
          this.type('bin')
        } else {
          this.json(body)
        }
        break
    }

    // 加上 utf-8
    if (typeof body === 'string') {
      encoding = 'utf8'
      type = this.get('Content-Type')
      this.set('Content-Type', setCharset(type, 'utf-8'))
    }

    // TODO: 加上 etag
  }

  json(obj) {
    const body = JSON.stringify(obj)
    this.set('Content-Type', 'application/json')
    return this.send(body)
  }

  jsonp(obj) {

  }

  sendFile(path, options, callback) {

  }

  download(path, filename, options, callback) {

  }

  cookie(name, value, options) {

  }

  clearCookie(name, options) {

  }

  redirect(url) {

  }
}
