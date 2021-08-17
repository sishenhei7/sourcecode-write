const { includes } = require("../../spread-operator/fixtures/large");

module.exports = arrayIncludes

function arrayIncludes([arr, item]) {
  return arr.includes(item)
}
