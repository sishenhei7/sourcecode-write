/* =======================简易渲染器========================== */

// import * as nodeOps from "./dom";
// import { createRenderer } from "./render";
// import "./style.css";

// const { render } = createRenderer(nodeOps);
// const vnode = {
//   type: "div",
//   children: ['test1', 'test2', {
//     type: 'p',
//     children: 'ppppppppppppp'
//   }],
// };
// render(vnode, document.querySelector<HTMLDivElement>("#app")!);

/* ======================初步响应式=========================== */

// import { reactive, effect } from './reactive'

// const obj = {
//   test: 1
// }

// const proxyObj = reactive(obj)
// effect(() => {
//   console.log(proxyObj.test);
// })

// setTimeout(() => {
//   console.log('触发响应式')
//   proxyObj.test = 33;
// }, 1000);

/* ======================相同的值=========================== */

// import { reactive, effect } from './reactive'

// const obj = {
//   test: 1
// }

// const proxyObj = reactive(obj)
// effect(() => {
//   console.log(proxyObj.test);
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.test = 1;
// }, 1000);

/* ========================分支的情况============================ */

// import { reactive, effect } from './reactive'

// const obj = {
//   a: true,
//   b: 2
// }

// const proxyObj = reactive(obj)
// effect(() => {
//   console.log('===', proxyObj.a ? proxyObj.b : null)
// })

// setTimeout(() => {
//   proxyObj.a = false;
// }, 1000);

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.b = 3;
// }, 1000);

/* ======================两个值的情况=========================== */

// import { reactive, effect } from './reactive'

// const obj = {
//   a: 1,
//   b: 2
// }

// const proxyObj = reactive(obj)
// effect(() => {
//   console.log(proxyObj.a + proxyObj.b);
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.b = 33;
// }, 1000);

/* ========================嵌套的情况============================ */

// import { reactive, effect } from './reactive'

// const obj = {
//   a: 1,
//   b: 2
// }

// const proxyObj = reactive(obj)
// effect(() => {
//   console.log('proxyObj.a', proxyObj.a)
//   effect(() => {
//     console.log('proxyObj.b', proxyObj.b)
//   })
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.b = 33;
// }, 1000);

/* ========================deep reactive的情况============================ */

// import { reactive, effect, shallowReactive } from './reactive'

// const obj = {
//   a: {
//     b: 2
//   },
//   c: 3
// }

// const proxyObj = reactive(obj)
// // const proxyObj = shallowReactive(obj)
// effect(() => {
//   console.log('proxyObj.a.b', proxyObj.a.b)
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.a.b = 33;
// }, 1000);

/* ========================++的情况============================ */

// import { reactive, effect } from './reactive'

// const obj = {
//   a: 1,
//   b: 2
// }

// const proxyObj = reactive(obj)
// effect(() => {
//   console.log('proxyObj.a', proxyObj.a)
//   proxyObj.a += 1
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.a = 33;
// }, 1000);

/* =========================this的情况=========================== */

// import { reactive, effect } from './reactive'

// const obj = {
//   a: 2,
//   get test () {
//     return this.a
//   }
// }

// const proxyObj = reactive(obj)
// effect(() => {
//   console.log(proxyObj.test);
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.a = 33;
// }, 1000);

/* =========================延迟的情况=========================== */

// import { reactive, effect } from './reactive'

// const obj = {
//   a: 2,
//   get test () {
//     return this.a
//   }
// }

// const proxyObj = reactive(obj)
// effect(() => console.log(proxyObj.test), {
//   scheduler(func: Function) {
//     setTimeout(() => {
//       func()
//     }, 0)
//   }
// })

// setTimeout(() => {
//   proxyObj.a = 33;
//   console.log('结束响应式', obj, proxyObj)
// }, 1000);

/* =========================合并的情况=========================== */

// import { reactive, effect } from './reactive'
// import { job, flush } from './scheduler'

// const obj = {
//   a: 2,
//   get test () {
//     return this.a
//   }
// }

// const proxyObj = reactive(obj)
// effect(() => console.log(proxyObj.test), {
//   scheduler(func: Function) {
//     job.add(func)
//     flush()
//   }
// })

// setTimeout(() => {
//   proxyObj.a += 1;
//   proxyObj.a += 1;
//   console.log('结束响应式', obj, proxyObj)
// }, 1000);

/* =========================计算属性的情况=========================== */

// import { reactive, computed } from './reactive'

// const obj = {
//   a: 2,
//   b: 3,
//   get test () {
//     return this.a
//   }
// }

// const proxyObj = reactive(obj)
// const sum = computed(() => {
//   console.log('计算属性====')
//   return proxyObj.a + proxyObj.b
// })

// setTimeout(() => {
//   proxyObj.a += 1;
//   console.log('计算属性', sum.value)
//   proxyObj.a += 1;
//   console.log('计算属性', sum.value)
// }, 1000);

/* =========================计算属性缓存的情况=========================== */

// import { reactive, computed } from './reactive'

// const obj = {
//   a: 2,
//   b: 3,
//   get test () {
//     return this.a
//   }
// }

// const proxyObj = reactive(obj)
// const sum = computed(() => {
//   console.log('计算属性====')
//   return proxyObj.a + proxyObj.b
// })

// setTimeout(() => {
//   console.log('计算属性', sum.value)
//   console.log('计算属性', sum.value)
// }, 1000);

/* =========================effect里面读计算属性的情况=========================== */

// import { reactive, effect, computed, weakMap } from './reactive'

// const obj = {
//   a: 2,
//   b: 3
// }

// const proxyObj = reactive(obj)
// const sum = computed(() => {
//   console.log('计算属性====')
//   return proxyObj.a + proxyObj.b
// })
// effect(() => {
//   console.log(sum.value)
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.b += 1
//   console.log('结束响应式', weakMap)
// }, 1000);

/* =========================watch的情况=========================== */

// import { reactive, watch } from './reactive'

// const obj = {
//   a: 2,
//   b: 3
// }

// const proxyObj = reactive(obj)
// watch(proxyObj, () => {
//   console.log('watch====', proxyObj.a)
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.a += 1
//   console.log('结束响应式')
// }, 1000);

/* =========================watch里面的新值和旧值的情况=========================== */

// import { reactive, watch } from './reactive'

// const obj = {
//   a: 2,
//   b: 3
// }

// const proxyObj = reactive(obj)
// watch(() => proxyObj.a, (newVal: any, oldVal: any) => {
//   console.log('watch====', newVal, oldVal)
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.a += 1
//   console.log('结束响应式')
// }, 1000);

/* =========================watch里面的flush的情况=========================== */

// import { reactive, watch } from './reactive'

// const obj = {
//   a: 2,
//   b: 3
// }

// const proxyObj = reactive(obj)
// watch(() => proxyObj.a, (newVal: any, oldVal: any) => {
//   console.log('watch====', newVal, oldVal)
// }, { flush: 'post' })

// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.a += 1
//   console.log('结束响应式')
// }, 1000);

/* =========================watch里面的onValidate的情况=========================== */

// import { reactive, watch } from './reactive'

// const obj = {
//   a: 2,
//   b: 3
// }

// const proxyObj = reactive(obj)
// watch(() => proxyObj.a, async (newVal: any, oldVal: any, onValidate: Function) => {
//   let expired = false
//   onValidate(() => expired = true)
//   await new Promise(resolve => setTimeout(resolve, 2000))
//   if (!expired) {
//     console.log('watch====', newVal, oldVal)
//   }
// })

// proxyObj.a = 22
// setTimeout(() => {
//   console.log('开始响应式')
//   proxyObj.a = 33
//   console.log('结束响应式')
// }, 1000);

/* =========================ref的情况=========================== */

// import { effect, ref } from './reactive'

// const a = ref(2)

// effect(() => {
//   console.log('ref====', a.value)
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   a.value += 1
//   console.log('结束响应式')
// }, 1000);

/* =========================响应丢失的情况=========================== */

// import { effect, reactive, toRef } from './reactive'

// const obj = {
//   a: 2
// }

// const proxyObj = reactive(obj)
// // const newObj = { ...proxyObj }
// const newObj = {
//   a: toRef(proxyObj, 'a')
// }

// effect(() => {
//   console.log('newProxyObj.a', newObj.a.value)
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   newObj.a.value += 1
//   console.log('结束响应式')
// }, 1000);

/* =========================toRefs的情况=========================== */

// import { effect, reactive, toRefs } from './reactive'

// const obj = {
//   a: 2
// }

// const proxyObj = reactive(obj)
// const newObj = { ...toRefs(proxyObj) }

// effect(() => {
//   console.log('newProxyObj.a', newObj.a.value)
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   newObj.a.value += 1
//   console.log('结束响应式')
// }, 1000);

/* =========================脱ref的情况=========================== */

// import { effect, reactive, toRefs, proxyRef } from './reactive'

// const obj = {
//   a: 2
// }

// const proxyObj = reactive(obj)
// const newObj = proxyRef({ ...toRefs(proxyObj) })

// effect(() => {
//   console.log('newProxyObj.a', newObj.a)
// })

// setTimeout(() => {
//   console.log('开始响应式')
//   newObj.a += 1
//   console.log('结束响应式')
// }, 1000);
