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
// const effectFunc = effect(() => {
//   console.log(proxyObj.test);
// })

// effectFunc()
// setTimeout(() => {
//   proxyObj.test = 33;
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
//   proxyObj.b = 3;
// }, 1000);

/* ========================嵌套的情况============================ */

import { reactive, effect } from './reactive'

const obj = {
  a: 1,
  b: 2
}

const proxyObj = reactive(obj)
effect(() => {
  console.log('proxyObj.a', proxyObj.a)
  effect(() => {
    console.log('proxyObj.b', proxyObj.b)
  })
})

setTimeout(() => {
  proxyObj.a = 33;
  // proxyObj.b = 3;
}, 1000);

/* =========================this的情况=========================== */

// import { reactive, effect } from './reactive'

// const obj = {
//   a: 2,
//   get test () {
//     return this.a
//   },
//   set test (val) {
//     this.a = val
//   }
// }

// const proxyObj = reactive(obj)
// effect(() => {
//   console.log(proxyObj.test);
// })

// setTimeout(() => {
//   proxyObj.test = 33;
// }, 1000);
