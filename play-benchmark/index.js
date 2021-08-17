const Suite = require('benchmarked')

// const prefix = 'spread-operator/'
const prefix = 'index-of/'
const suite = new Suite({
  cwd: __dirname,
  fixtures: `${prefix}fixtures/*.js`,
  code: `${prefix}code/*.js`
})

suite.run()
