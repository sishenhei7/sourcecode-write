import setPrototypeOf from 'setprototypeof'

export default function (app) {
  return function expressInit(req, res, next) {
    req.res = res
    res.req = req
    res.next = next

    setPrototypeOf(req, app.request)
    setPrototypeOf(res, app.response)

    next()
  }
}
