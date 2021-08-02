import http from 'http'

export default class Response extends http.ServerResponse {
  constructor() {
    super()
  }

  status(code) {
    this.statusCode = code
    return this
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
