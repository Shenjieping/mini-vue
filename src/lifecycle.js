import Watcher from "./observer/watcher";
import { patch } from './vdom/patch'

export function mountComponent(vm, el) {
  vm.$el = el; // 真实的dom元素

  callHook(vm, 'beforeMount') // 挂载之前的钩子
  // 渲染页面
  let updateComponent = () => { // 渲染和更新都会调用此方法
    // 返回的是虚拟DOM，传给update 进行渲染操作
    vm._update(vm._render());
  }
  // 渲染Watcher。每个组件都有一个Watcher
  new Watcher(vm, updateComponent, () => {}, true); //true 表示他是一个渲染Watcher

  callHook(vm, 'mounted') // 挂载结束的钩子

  /* 
    Watcher 就是用来渲染的
    vm._render 通过解析render方法，渲染出虚拟dom
    vm._update 通过虚拟dom,创建真实的dom
   */
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this;
    // 通过虚拟节点，渲染出真实的dom
    vm.$el = patch(vm.$el, vnode); // 需要用虚拟节点创建出真实节点，替换掉原有的$el
  }
}

// 此方法调用传入的生命周期钩子
export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    handlers.forEach(fn => fn.call(vm));
  }
}