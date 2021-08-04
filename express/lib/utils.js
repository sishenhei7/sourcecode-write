import etag from 'etag'
import { Buffer } from 'safe-buffer'
import parseUrl from 'parseUrl'
import contentType from 'content-type'

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

export const generateEtag = (body, encoding) => {
  const buf = Buffer.isBuffer(body) ? Buffer.from(body, encoding) : body
  return etag(buf)
}

exports.setCharset = function setCharset(type, charset) {
  if (!type || !charset) {
    return type;
  }

  var parsed = contentType.parse(type);
  parsed.parameters.charset = charset;
  return contentType.format(parsed);
};
