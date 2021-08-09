import Koa from '@lib/index'

const app = new Koa()

app.use(async function (ctx: any) {
  ctx.body = 'Hello World'
})

app.listen(3000)
