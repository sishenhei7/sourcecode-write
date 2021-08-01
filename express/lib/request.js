import http from 'http'
import accepts from 'accepts'

export default class Request extends http.IncomingMessage {
  head(name) {
    if (['referrer', 'referer'].includes(name)) {
      return this.head.referer || this.head.referrer
    }

    return this.head[name]
  }

  get(name) {
    return this.head(name)
  }

  accept(...args) {
    const accept = accepts(this)
    return accept.types.apply(accept, args)
  }


}