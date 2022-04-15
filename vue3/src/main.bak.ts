console.log('===============test===========')


const obj = {
  a: 1
}

const proxyObj = new Proxy(obj, {
  get(target: Record<string, any>, property: string) {
    return target[property]
  },
  set(target: Record<string, any>, property: string, value: any) {

  }
})

const effectFunc = () => {
  console.log(proxyObj.a)
}

setTimeout(() => {
  proxyObj.a = 33
}, 1000);

