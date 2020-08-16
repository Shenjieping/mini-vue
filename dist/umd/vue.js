(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  // 用于观测数据，给每个属性添加 get 和 set 方法
  function observe(value) {
    console.log(value);
  }

  function initState(vm) {
    var opts = vm.$options; // Vue 的数据来源

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    // 数据初始化
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持，用户改变了数据，我希望能检测到，从而更新页面
    // MVVM 数据变化可以驱动视图
    // 通过Object.defineProperty 给属性增加get和set方法

    observe(data); // 响应式原理
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this; // vue 中使用 this.$options 指代的就是用户传递的属性

      vm.$options = options; // 初始化转态

      initState(vm); // 分割代码
    };
  }

  // Vue核心代码

  function Vue(options) {
    // 进行Vue的初始化操作
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
