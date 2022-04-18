const p = Promise.resolve()
export const job = new Set<Function>()

let isFlushing = false
export function flush() {
  if (isFlushing) return
  isFlushing = true
  p.then(() => {
    job.forEach(task => task())
  })
  job.clear()
}