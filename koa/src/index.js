require('./test.js')
const debug = require('debug')('koa:application')
debug('index')
setTimeout(() => {
  debug('index 1s')
}, 1000);