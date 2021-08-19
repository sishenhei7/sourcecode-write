module.exports = arrayFor

function noop() {}

function arrayFor(arr) {
  arr.forEach((item, index) => {
    noop(item, index)
  })
  return
}
