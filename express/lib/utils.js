import parseUrl from 'parseUrl'

export const consoleAll = (obj) => {
  Object.keys(obj).forEach((key) => {
    console.log(key, obj[key])
  })
}

export const getPathname = (req) => {
  try {
    return parseUrl(req).pathname
  } catch (err) {
    return undefined
  }
}

export const decodeParam = (str) => {
  if (typeof str !== 'string' || str.length === 0) {
    return str
  }

  try {
    decodeURIComponent(str)
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param '${str}'`
      err.status = err.statusCode = 400
    }

    throw err;
  }
}
