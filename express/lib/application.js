import http from 'http'

export default class App {
  constructor(options) {

  }

  listen(...args) {
    const server = http.createServer(this)
    return server.listen(...args)
  }
}