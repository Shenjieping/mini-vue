(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(obj) {
    return obj && _typeof(obj) === 'object';
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.value = value;

      if (Array.isArray(value)) ; else {
        // 如果是对象，则进行下一步
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(obj) {
        var keys = Object.keys(obj); // 循环每一个key，添加get/set

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = obj[key];
          defineReactive(obj, key, value); // 定义响应式数据
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(obj, key, value) {
    // 递归设置嵌套的对象
    observe(value);
    Object.defineProperty(obj, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        // 设置值的时候做一些操作
        if (value === newValue) {
          return;
        }

        console.log('update 视图更新');
        observe(newValue); // 如果新设置的值是一个对象，也要被监控

        value = newValue;
      }
    });
  } // 用于观测数据，给每个属性添加 get 和 set 方法

  function observe(value) {
    if (!isObject(value)) {
      return;
    }

    return new Observer(value);
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
