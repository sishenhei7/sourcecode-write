import path from 'path'
import http from 'http'
import send from 'send'
import cookie from 'cookir'
import encodeUrl from 'encodeurl'
import onFinished from 'on-finished'
import contentDisposition from 'content-disposition'
import { Buffer } from 'safe-buffer'
import { sign } from 'cookie-signature'
import { setCharset } from './utils.js'

const resolve = path.resolve
const extname = path.extname
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

  append(name, val) {
    let prev = this.get(name)
    if (prev) {
      val = Array.isArray(prev) ? prev.concat(val) : [prev].concat(val)
    }
    return this.set(name, val)
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

  attachment(filename) {
    if (filename) {
      this.type(extname(filename))
    }

    return this.set('Content-Disposition', contentDisposition(filename))
  }

  sendFile(path, options, callback) {
    const { req } = this
    const res = this
    const next = req.next
    let done = callback
    let opts = options || {}

    if (typeof options === 'function') {
      done = options
      opts = {}
    }

    const pathname = encodeUrl(path)
    const file = send(req, pathname, opts)
    this.sendfileStream(res, file, opts, function (err) {
      if (done) {
        return done(err)
      }

      if (err && err.code === 'EISDIR') {
        return next()
      }

      if (err && err.code !== 'ECONNABORTED' && err.syscall !== 'write') {
        next(err)
      }
    })
  }

  sendfileStream(res, file, options, callback) {
    let done = false
    let streaming

    function onaborted() {
      if (done) return
      done = true

      var err = new Error('Request aborted')
      err.code = 'ECONNABORTED'
      callback(err)
    }

    function ondirectory() {
      if (done) return
      done = true

      var err = new Error('EISDIR, read')
      err.code = 'EISDIR'
      callback(err)
    }

    function onerror(err) {
      if (done) return
      done = true
      callback(err)
    }

    function onend() {
      if (done) return
      done = true
      callback()
    }

    function onfile() {
      streaming = false
    }

    function onfinish(err) {
      if (err && err.code === 'ECONNRESET') return onaborted()
      if (err) return onerror(err)
      if (done) return

      setImmediate(function () {
        if (streaming !== false && !done) {
          onaborted()
          return
        }

        if (done) return
        done = true
        callback()
      })
    }

    function onstream() {
      streaming = true;
    }

    file.on('directory', ondirectory)
    file.on('end', onend)
    file.on('error', onerror)
    file.on('file', onfile)
    file.on('stream', onstream)
    onFinished(res, onfinish)

    if (options.headers) {
      // set headers on successful transfer
      file.on('headers', function headers(res) {
        var obj = options.headers
        var keys = Object.keys(obj)

        for (var i = 0; i < keys.length; i++) {
          var k = keys[i]
          res.setHeader(k, obj[k])
        }
      })
    }

    file.pipe(res)
  }

  download(path, filename, options, callback) {
    let name = filename
    let opts = options || null
    let done = callback

    if (typeof filename === 'function') {
      done = filename
      name = ''
      opts = null
    } else if (typeof options === 'function') {
      done = options
      opts = null
    }

    const headers = { 'Content-Disposition': contentDisposition(name || path) }
    if (opts && opts.headers) {
      for (key in opts.headers) {
        if (key.toLowerCase() !== 'content-disposition') {
          headers[key] = opts.headers[key]
        }
      }
    }
    opts.headers = headers

    const fullPath = resolve(path)
    return this.sendFile(fullPath, opts, done)
  }

  cookie(name, value, options) {
    const opts = { ...options }
    const { signed, maxAge, path } = opts
    const { secret } = this.req

    if (signed && !secret) {
      throw new Error('cookieParser("secret") required for signed cookies')
    }

    let val = typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value)

    if (signed) {
      val = `s:${sign(val, secret)}`
    }

    if (maxAge != null) {
      opts.expires = new Date(new Date + maxAge)
      opts.maxAge /= 1000
    }

    if (path == null) {
      opts.path = '/'
    }

    this.append('Set-Cookie', cookie.serialize(name, val, opts))
    return this
  }

  clearCookie(name, options) {
    const opts = {
      expires: new Date(1),
      path: '/',
      ...options
    }
    this.cookie(name, '', opts)
  }

  location(url) {
    let loc = url

    if (url === 'back') {
      loc = this.req.get('referer') || '/'
    }

    return this.set('Location', encodeUrl(loc))
  }

  redirect(url) {
    this.location(url)
    this.status(302)
    this.set('Content-Length', 0)
    this.end()
  }
}
