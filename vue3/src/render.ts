export interface Vnode {
  type: string | object
  children?: string | string[] | Vnode[] | (Vnode | string)[]
}

export interface NodeOps {
  createElement: Function
  createTextNode: Function
  insertBefore: Function
  appendChild: Function
}

export function createRenderer(nodeOps: NodeOps) {
  const render = (vnode: string | Vnode, container: Element) => {
    if (typeof vnode === 'string') {
      const text = nodeOps.createTextNode(vnode)
      nodeOps.appendChild(text, container)
      return
    }

    const { type, children = [] } = vnode;

    let node: Element;
    if (typeof type === 'string') {
      node = nodeOps.createElement(type);
      nodeOps.appendChild(node, container);
    }

    if (typeof children === 'string') {
      nodeOps.appendChild(nodeOps.createTextNode(children), node!)
    } else if (children.length > 0) {
      children.forEach(child => render(child, node))
    }
  }

  const hydrate = () => 1;
  const mountApp = () => 1

  return {
    render,
    hydrate,
    mountApp
  }
}
