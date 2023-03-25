/**
 * 获取 style 标签
 */
export function getDOM(id: string) {
  const d: HTMLStyleElement = document.querySelector(`#${id}`) || document.createElement('style')
  d.setAttribute('id', id)
  document.head.appendChild(d)
  return d
}

/**
 * 更新style标签内容
 */
export function setStyle(dom: HTMLStyleElement, style: string) {
  dom.innerHTML = style
  return dom
}
