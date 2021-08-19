module.exports = arrayFor

function arrayFor(arr, item) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === item) {
      return true
    }
  }
  return false
}
