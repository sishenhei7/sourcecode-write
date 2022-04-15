export function createElement(type: string) {
  return document.createElement(type)
}

export function createTextNode(content: string) {
  return document.createTextNode(content)
}

export function insertBefore(node: Element, refNode: Element) {
  document.insertBefore(node, refNode)
}

export function appendChild(node: Element, parentNode: Element) {
  parentNode.appendChild(node)
}
