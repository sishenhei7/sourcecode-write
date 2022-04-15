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

/* ============================================================ */

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

/* ============================================================ */

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

/* ============================================================ */

import { reactive, effect } from './reactive'

const obj = {
  a: 1,
  b: 2
}

const proxyObj = reactive(obj)
effect(() => {
  console.log('proxyObj.d', proxyObj.a)
  effect(() => {
    console.log('proxyObj.d', proxyObj.b)
  })
})

setTimeout(() => {
  proxyObj.a = 33;
  proxyObj.b = 3;
}, 1000);

/* ============================================================ */

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
