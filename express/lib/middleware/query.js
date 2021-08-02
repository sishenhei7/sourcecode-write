import qs from 'qs'
import parseUrl from 'parseurl'

export default function (req, res, next) {
  if (!req.query) {
    const queryStr = parseUrl(req).query
    req.query = qs.parse(queryStr)
  }

  next()
}
