const autocannon = require('autocannon')
async function test() {
  const result = await autocannon({
    url: 'http://localhost:8080/api/tick',
    connections: 5000, // -c 并发数 默认10
    pipelining: 5, //-p 每个连接进程请求数量 默认1
    duration: 10 // -d 执行时间 单位秒
  })
  console.log(result)
  return result
}

test()