import { reactive, effect } from './reactive.bak'

console.log('===============test===========')

const obj = {
  a: 1,
  b: 2,
  c: true
}

const proxyObj = reactive(obj)

effect(() => {
  console.log(proxyObj.c ? proxyObj.a : proxyObj.b)
})

setTimeout(() => {
  proxyObj.a = 33
  proxyObj.c = false
  proxyObj.a = 44
}, 1000);

