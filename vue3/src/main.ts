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
