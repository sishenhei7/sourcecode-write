import http from 'http'
import Emmiter from 'events'
import Debug from 'debug'

const debug = Debug('koa:application')

export default class Application extends Emmiter {
  constructor() {
    super()
  }

  use(fn: any) {
    // TODO: use
    console.log(fn)
  }

  listen(...args: any) {
    debug('listen')
    const server = http.createServer(this.callback)
    return server.listen(...args)
  }

  callback() {
    // TODO: callback
    console.log('callback')
  }
}
