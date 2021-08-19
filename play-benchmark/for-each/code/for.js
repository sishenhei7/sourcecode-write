module.exports = arrayFor

function noop() {}
function arrayFor(arr) {
  for (let i = 0; i < arr.length; i += 1) {
    noop(arr[i])
  }
  return
}
