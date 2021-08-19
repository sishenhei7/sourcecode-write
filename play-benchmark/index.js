const Suite = require('benchmarked')
const { access } = require('fs')

const args = process.argv.slice(2)
const prefix = args[0]

if (!prefix) {
  console.error('请在命令行输入文件名！')
  return
}

access(prefix, (err) => {
  if (err) {
    console.error(`文件${prefix}不存在`)
    return
  }

  const suite = new Suite({
    cwd: __dirname,
    fixtures: `${prefix}/fixtures/*.js`,
    code: `${prefix}/code/*.js`
  })
  suite.run()
})

