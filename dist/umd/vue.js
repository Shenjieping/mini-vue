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

  /**
   * @param {any} obj 需要判断的对象
   * @returns {boolean}
   */
  function isObject(obj) {
    return obj && _typeof(obj) === 'object';
  }
  /**
   * 给某个对象设置私有属性
   * @param {Object} obj 需要添加的对象
   * @param {string} key 属性
   * @param {any} val 值
   * @param {boolean} enumerable 是否可枚举
   */

  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /* 
    我们要对数组的 7 个方法进行重写：
      push, pop, shift, unshift, reverse, sort, splice
    因为这7个方法会改变原数组
   */
  var arrayProto = Array.prototype; // 原型链查找，会向上查找，先查找我们重写的，如果没有再向上查找原型链上的

  var arrayMethods = Object.create(arrayProto); // 拷贝原型上的方法，防止我们的代码破坏了原型链

  var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
  methodsToPatch.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 调用我们的方法后。又去调用了原生的方法
      var result = arrayProto[method].apply(this, args);
      var ob = this.__ob__; // 将实例上的方法传过来
      // push shift splice 添加的值可能还是一个对象

      var inserted; // 保存当前用户插入的元素

      switch (method) {
        case 'push':
        case 'shift':
          inserted = args;
          break;

        case 'splice':
          // splice有3个属性，只有最后一个属性才是新增的值
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        // 将新增的属性继续观察
        ob.observerArray(inserted);
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.value = value; // 给当前值，添加一个不可枚举的私有属性，并于传值

      def(value, '__ob__', this); // 这里如果不设置为不可枚举的值，会导致死循环

      if (Array.isArray(value)) {
        // 如果是数组的话。并不会对索引进行观察。因为会导致性能问题
        // 如果数组里放的是对象。我再对里面的对象进行监控
        this.observerArray(value); // 我们还需要对 push pop shift unshift splice reverse sort 进行重写

        value.__proto__ = arrayMethods;
        /* 
          源码这里做了一个兼容处理，因为IE老浏览器是不支持 __proto__ 设置原型链
          咋们这里为了简化，不做处理
         */
      } else {
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
    }, {
      key: "observerArray",
      value: function observerArray(items) {
        for (var i = 0; i < items.length; i++) {
          observe(items[i]);
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
    /* 
      通过Vue源码可以看出，data还可以设置 get/set属性
        如果设置了get，需要先执行函数，拿到返回值再进行处理。为了简化，这里不做这一层的处理
     */
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

  // 字母a-zA-Z_ - . 数组小写字母 大写字母
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名
  // ?:匹配不捕获   <aaa:aaa>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // startTagOpen 可以匹配到开始标签 正则捕获到的内容是 (标签名)

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名
  // 闭合标签 </xxxxxxx>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
  // <div aa   =   "123"  bb=123  cc='123'
  // 捕获到的是 属性名 和 属性值 arguments[1] || arguments[2] || arguments[2]

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
  // <div >   <br/>

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  function parseHTML(html) {
    // 不停的去解析html字符串
    while (html) {
      var textEnd = html.indexOf('<'); // 从html < 开始匹配

      if (textEnd === 0) {
        // 如果当前索引为0,肯定是一个标签，可能是开始标签，也可能是结束标签，第一次肯定是开始标签
        var startTagMatch = parseStartTag(); // 通过此方法获取到匹配的结果 tagName attrs

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue; // 如果开始标签匹配完之后，继续下一次匹配
        }

        var endTagMatch = html.match(endTag); // 匹配结尾标签

        if (endTagMatch) {
          // 如果是结尾标签，则删除
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        // 获取标签内的文本
        text = html.substring(0, textEnd);
        chars(text);
      }

      if (text) {
        // 如果文本存在，删除文本
        advance(text.length);
      }
    }

    function parseStartTag() {
      var start = html.match(startTagOpen); // 如果匹配到就是开始标签

      if (start) {
        var match = {
          tagName: start[1],
          // 标签名
          attrs: [] // 属性

        };
        advance(start[0].length);

        var _end, attr; // 解析属性，如果不是 > 结束标签，且有属性，则匹配


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          }); // 将标签和属性保存起来

          advance(attr[0].length); // 将属性去掉
        }

        if (_end) {
          // 去掉结束的 >
          advance(_end[0].length);
        }

        return match;
      }
    } // 删除匹配到的结果，不断向前走


    function advance(n) {
      html = html.substring(n);
    }
  }

  function start(tagName, attrs) {
    // 开始标签
    console.log('标签，属性', tagName, attrs);
  }

  function chars(text) {
    // 文本节点
    console.log('文本', text.trim());
  }

  function end(tagName) {
    // 结束标签
    console.log('结尾', tagName);
  }

  /* 
    ast 语法树 -> 用对象来描述原生的语法
    虚拟DOM -> 用对象来描述DOM节点
   */

  function compileToFunction(template) {
    var ast = parseHTML(template);
    return function render() {};
  }
  /* 
    <div id="app">
      <p>test</p>
    </div>

    AST语法树, 用一种抽象的语法来描述原生的HTML结构
    let root = {
      tag: 'div',
      attrs: [{name: 'id', value: 'app'}],
      type: 1,
      children: [{
        tag: 'p',
        attrs: [],
        type: 1,
        children: [{
          type: 3,
          text: 'test'
        }]
      }]
    }
   */

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this; // vue 中使用 this.$options 指代的就是用户传递的属性

      vm.$options = options; // 初始化转态

      initState(vm); // 分割代码
      // 如果用户传入了el属性，需要将页面渲染出来
      // 如果用户传入了el，就要实现挂载的流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 默认会先查找render，没有就会采用 template,在没有就用html

      if (!options.render) {
        // 对模板进行编译
        var template = options.template;

        if (!template && el) {
          // 使用的html
          template = getOuterHTML(el); // 拿到所有的DOM文档
        } // 我们需要将template转换为render方法


        var render = compileToFunction(template);
        options.render = render;
      }
    };
  }

  function getOuterHTML(el) {
    // 获取html元素
    if (el.outerHTML) {
      // outerHTML 在IE中不兼容
      return el.outerHTML;
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
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
