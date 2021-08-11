export function only<T extends Record<string, unknown>>(obj: T, keys: string | string[]): Partial<T> {
  obj = obj || {}
  keys = typeof keys === 'string' ? keys.split(/ +/) : keys
  return keys.reduce((accu: Partial<T>, curr: keyof T) => {
    if (obj[curr] == null) return accu
    accu[curr] = obj[curr]
    return accu
  }, {})
}
