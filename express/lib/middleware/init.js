import setPrototypeOf from 'setprototypeof'

export default function (app) {
  return function expressInit(req, res, next) {
    req.req = req
    res.res = res
    res.next = next

    setPrototypeOf(req, app.request)
    setPrototypeOf(res, app.response)

    next()
  }
}
