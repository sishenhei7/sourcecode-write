const debug = require('debug')('koa:test')
debug('test')
setTimeout(() => {
  debug('test 1s')
}, 1000);