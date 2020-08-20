import { observe } from "./observer/index";
import { proxy } from "./util/index";

export function initState(vm) {
  const opts = vm.$options;
  // Vue 的数据来源
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethods(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

function initProps(vm) {
  
}
function initMethods(vm) {
  
}
function initData(vm) {
  // 数据初始化
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  // 对象劫持，用户改变了数据，我希望能检测到，从而更新页面
  // MVVM 数据变化可以驱动视图

  // 为了让用户更好的使用，需要将属性直接代理到 vm 上,用户可以通过 vm.xx 取值
  for (let key in vm._data) {
    proxy(vm, '_data', key);
  }

  // 通过Object.defineProperty 给属性增加get和set方法
  observe(data); // 响应式原理
}
function initComputed(vm) {
  
}
function initWatch(vm) {
  
}