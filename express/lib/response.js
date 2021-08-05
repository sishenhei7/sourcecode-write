import { Buffer } from 'buffer'
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
    const { app } = this

    // content-type
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

    // string 加上 utf-8
    if (typeof body === 'string') {
      encoding = 'utf8'
      type = this.get('Content-Type')
      this.set('Content-Type', setCharset(type, 'utf-8'))
    }

    if (body != null) {
      // content-length
      body = Buffer.isBuffer(body) ? body : Buffer.from(body, encoding)
      encoding = undefined
      this.set('Content-Length', body.length)

      // etag
      const generateEtag = app.get('etag fn')
      this.set('etag', generateEtag(body))
    }

    // 处理 204 和 304
    if ([204, 304].includes(this.statusCode)) {
      this.removeHeader('Content-Type')
      this.removeHeader('Content-Length')
      this.removeHeader('Transfer-Encoding')
      body = ''
    }

    // 处理 head
    if (req.method === 'HEAD') {
      this.end()
    } else {
      this.end(body, encoding)
    }

    return this
  }

  json(obj) {
    const body = JSON.stringify(obj)
    this.set('Content-Type', 'application/json')
    return this.send(body)
  }

  jsonp(obj) {
    const { app, req } = this
    let body = JSON.stringify(obj)
    let callbackName = req.query[app.get('jsonp callback name')]

    if (!this.get('Content-Type')) {
      this.set('X-Content-Type-Options', 'nosniff')
      this.set('Content-Type', 'application/json')
    }

    if (Array.isArray(callbackName)) {
      callbackName = callbackName[0]
    }

    if (callbackName && typeof callbackName === 'string') {
      this.set('X-Content-Type-Options', 'nosniff')
      this.set('Content-Type', 'text/javascript')
      callbackName = callbackName.replace(/[^\[\]\w$.]/g, '')
      body = body.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
      body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');'
    }

    return this.send(body)
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
