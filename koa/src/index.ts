import Koa from '@lib/index'
import { Context } from '@lib/context'

const app = new Koa()

app.use(async function (ctx: Context) {
  ctx.body = 'Hello World'
})

app.listen(3000)
