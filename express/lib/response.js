import http from 'http'
import send from 'send'

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

  type(type) {
    const mimeType = type.includes('/') ? type : mime.lookup(type)
    this.set('content-type', mimeType)
  }

  send(body) {

  }

  json(obj) {

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
