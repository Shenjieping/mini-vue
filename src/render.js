import { createElement, createTextNode } from "./vdom/create-element";

export function renderMinxin(Vue) {
  // 渲染虚拟DOM
  Vue.prototype._render = function() {
    const vm = this;
    const { render } = vm.$options;

    const vnode = render.call(vm); // 去实例化，取值
    return vnode;
  }
  /* 
    _c 创建元素的虚拟节点
    _v 创建文本的虚拟节点
    _s JSON.stringfiy
   */
  Vue.prototype._c = function() {
    return createElement(...arguments); //tagm data, children
  }
  Vue.prototype._v = function(text) {
    return createTextNode(text);
  }
  Vue.prototype._s = function(val) {
    if (!val) {
      return '';
    } else if (typeof val === 'object') {
      return JSON.stringify(val);
    }
    return val;
  }
}