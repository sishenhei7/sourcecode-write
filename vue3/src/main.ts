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
//   proxyObj.a = 33;
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

import { reactive, effect, computed } from './reactive'

const obj = {
  a: 2,
  b: 3,
  get test () {
    return this.a
  }
}

const proxyObj = reactive(obj)
const sum = computed(() => {
  console.log('计算属性====')
  return proxyObj.a + proxyObj.b
})
effect(() => {
  console.log(sum.value)
})


setTimeout(() => {
  proxyObj.a += 1
}, 1000);