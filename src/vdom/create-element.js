import VNode from './vnode';

export function createElement(tag, data = {}, ...children) {
  return new VNode(tag, data, children, undefined);
}

export function createTextNode(text) {
  // 创建文本节点
  return new VNode(undefined, undefined, undefined, text);
}

// 虚拟节点，就是通过 _c _v 实现用对象来描述dom的操作
// 将template 转换成AST语法树 -> 生成render方法 -> 生成虚拟dom -> 生成真实dom
// 页面更新，重新生成虚拟dom -> diff更新dom