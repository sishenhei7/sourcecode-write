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

import { reactive, effect } from './reactive'

const obj = {
  test: 1
}

const proxyObj = reactive(obj)
const effectFunc = effect(() => {
  console.log(proxyObj.test);
})

effectFunc()
setTimeout(() => {
  proxyObj.test = 33;
}, 1000);



