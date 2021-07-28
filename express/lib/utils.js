export const consoleAll = (obj) => {
  Object.keys(obj).forEach((key) => {
    console.log(key, obj[key])
  })
}
