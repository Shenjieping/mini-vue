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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  /**
   * 
   * @param {object} vm 代理的对象
   * @param {string} source 
   * @param {string} key 代理的属性
   */

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
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

      ob.dep.notify(); // 如果用户调用了这里的方法，去通知视图更新

      return result;
    };
  });

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++; // 记录一个唯一的id，用于后面的去重

      this.subs = []; // 这里存放依赖的watcher
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // watcher 和 dep 的关系：一个watcher 对应多个depl，一个dep对应多个Watcher，他们之间要互相记录一下
        // this.subs.push(Dep.target); // 观察者模式，这样可能会重复调用
        // 让这个Watcher记住我的dep
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        // 这里放的就是Watcher
        this.subs.push(watcher);
      }
    }]);

    return Dep;
  }();
  var stack = [];
  Dep.target = null; // 目前可以做到将Watcher保存起来，和移除

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.value = value;
      this.dep = new Dep(); // 给数组用的
      // 给当前值，添加一个不可枚举的私有属性，并于传值

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
    var dep = new Dep(); // 这个dep只能给对象使用
    // 递归设置嵌套的对象,但是这里的value可能是对象，也可能是数组，返回的是当前observer对应的实例

    var childOb = observe(value);
    Object.defineProperty(obj, key, {
      get: function get() {
        // 每个属性都对应着自己的渲染Watcher
        if (Dep.target) {
          // 如果当前有Watcher
          dep.depend(); // 我要将Watcher存起来

          if (childOb) {
            // 主要是对数组的依赖收集
            childOb.dep.depend(); // 收集了数组的相关依赖
            // 数组数组中嵌套了数组，也需要依赖收集

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        // 设置值的时候做一些操作
        if (value === newValue) {
          return;
        } // console.log('update 视图更新');


        observe(newValue); // 如果新设置的值是一个对象，也要被监控

        value = newValue;
        dep.notify(); // 通知依赖更新操作
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

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i]; // 将数组中的每一个都取出来，数据变化后也去更新视图
      // 数组中的数组也需要依赖收集

      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        // 如果是数组，进行递归
        dependArray(current);
      }
    }
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
    // 为了让用户更好的使用，需要将属性直接代理到 vm 上,用户可以通过 vm.xx 取值

    for (var key in vm._data) {
      proxy(vm, '_data', key);
    } // 通过Object.defineProperty 给属性增加get和set方法


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
    var root; // 根节点

    var stack = []; // 判断是否是闭合标签

    var currentParent; // 用来标识当前元素的父节点

    var ELEMENT_TYPE = 1; // 元素节点

    var TEXT_TYPE = 3; // 文本节点
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

    function start(tagName, attrs) {
      // 开始标签，创建一个AST元素
      var element = createAstElement(tagName, attrs);

      if (!root) {
        // 第一次没有root，就生成一个根节点
        root = element;
      }

      currentParent = element; // 把点前元素标记成ast树

      stack.push(element); // 将当前标签存放到栈中
    }

    function chars(text) {
      text = text.trim(); // 文本节点

      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    }

    function end(tagName) {
      // 结束标签
      var element = stack.pop(); // 判断标签是否已经闭合，此处暂未考虑自闭合的标签

      if (element.tag !== tagName) {
        throw new TypeError('标签未闭合');
      } // 我要标识当前这个元素是属于父元素的


      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element); // 实现了一个树的父子关系
      }
    }

    function createAstElement(tagName, attrs) {
      // 基本的树结构
      return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function generage(el) {
    // 获取孩子节点
    var children = genChildren(el.children);
    var code = "_c(\"".concat(el.tag, "\", ").concat(genProps(el.attrs)).concat(children ? ",".concat(children) : '', ")");
    return code;
  } // 处理成属性，拼接成字符串

  function genProps(attrs) {
    // console.log(attrs)
    if (!attrs.length) {
      // 如果没有属性就返回undefined
      return undefined;
    }

    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          // 拼接style
          // style="color: red" => {style: {color: 'red'}}
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ": ").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  } // 处理孩子节点


  function genChildren(children) {
    if (children && children.length > 0) {
      // 拿到所有的孩子
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type === 1) {
      // 元素标签
      return generage(node);
    } else {
      // 文本
      var text = node.text; // 还需要将里面的变量拿出来处理
      // a {{name}} b {{age}} c  => _v("a" + _s(name) + "b" + _s(age) + "c");

      var tockens = [];
      var match, index; // 每次匹配的偏移量

      var lastIndex = defaultTagRE.lastIndex = 0; // 循环匹配大括号内的变量

      while (match = defaultTagRE.exec(text)) {
        index = match.index; // 将第一个文本放进去

        if (index > lastIndex) {
          // 给文本加上双引号，后面解析的时候代表是一个字符串
          tockens.push(JSON.stringify(text.slice(lastIndex, index)));
        } // 变量取出后用 _s 包裹


        tockens.push("_s(".concat(match[1].trim(), ")")); // 设置偏移量，下次匹配从此处开始

        lastIndex = index + match[0].length;
      } // 将最后一个文本放进去


      if (lastIndex < text.length) {
        tockens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tockens.join('+'), ")");
    }
  }

  /* 
    ast 语法树 -> 用对象来描述原生的语法
    虚拟DOM -> 用对象来描述DOM节点
   */

  function compileToFunction(template) {
    // 解析HTML字符串，变成AST语法树
    var ast = parseHTML(template); // 需要将AST树转为render函数，其实就是字符串拼接
    // 核心思路就是，将模板转换为一下的字符串
    // <div id="app"><p>hello {{ name }}</p>{{ age }}</div>
    // 将AST转为js方法
    // _c('div', {id: app}, _c('p', undefined, _v('hello' + _s(name))), _s(age))
    // console.log(ast);

    var code = generage(ast); // console.log(code);
    // 所有的模板引擎实现，都需要用new Fucntion() 和 with

    var renderFn = new Function("with(this){return ".concat(code, "}")); // console.log(renderFn);

    return renderFn;
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

  var callbacks = []; // 将用户放入的cb,和内部的cb 都存到一个数组中，最后一起更新

  var pending = false; // 这个队列是否正在等待更新

  function nextTick(cb) {
    callbacks.push(cb);

    if (!pending) {
      setTimeout(flushCallbacks, 0);
      /* 
        这里内部做一层优化，先使用微任务，如果不支持再使用宏任务
          1. 优先使用promise.then，但是在IE低版本中不支持，这里还有一个坑，在IOS的UIwebview中，执行完微任务之后，不会清空队列，需要再执行一下宏任务
          2. 如果promise 不支持，则使用 window.MutationObserver，这个在IE中不支持，并且在IOS中，会有一些诡异的行为，有时不会触发，所以源码也排除了
          3. 如果上面的两个微任务都不支持，则使用宏任务，在宏任务中优先使用 setImmediate，这个只在IE下兼容
          4. 最后以上都不兼容，则降级到 setTimeout
       */

      pending = true; // 如果正在调用，就拦截一下，防止重复执行
    }
  }

  function flushCallbacks() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    pending = false;
    callbacks = []; // 执行完之后把队列清空
  }

  var queue = [];
  var has = {}; // 去重

  function queueWatcher(watcher) {
    // 批量更新
    var id = watcher.id;

    if (!has[id]) {
      // 这里拦截了。每次只能放进去一个值
      queue.push(watcher);
      has[id] = true; // 宏任务、微任务（微任务使用了Vue.nextTick, 对异步方法进行封装）
      // Vue.nextTick => promise / mutationObserver / setImmediate / setTimeout 优雅降级的过程

      nextTick(flushSchedulerQueue);
      /*
      setTimeout(() => {
        queue.forEach(watcher => watcher.run())
        queue = []; // 执行完之后将队列清空，下次继续清空
        has = {};
      }, 0); */
    }
  }

  function flushSchedulerQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    queue = []; // 执行完之后将队列清空，下次继续清空

    has = {};
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.cb = cb;
      this.id = id$1++;
      this.options = options;
      this.isRenderWatcher = isRenderWatcher;
      this.depsId = new Set();
      this.deps = []; // 这个watcher会存放所有的dep

      vm._watcher = this;
      this.getter = expOrFn; // 将内部传过来的函数放在getter属性上

      this.get(); // 调用get方法，会让渲染Watcher执行

      this.value = undefined;
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        // console.log('update'); // 多次调用同一个属性，只更新最后一次
        var vm = this.vm;
        pushTarget(this); // 将当前的Watcher存起来

        var value = this.getter.call(vm); // 执行的就是 vm._update

        popTarget(); // 移除Watcher

        return value;
      }
    }, {
      key: "update",
      value: function update() {
        // 这里需要等待一起更新，因为每次调用 update 都会存入一个watcher
        // this.get();
        queueWatcher(this); // 先存到一个队列，等同步代码执行完之后再去执行
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        // watcher 不能放重读的dep，同样dep里不能放重复的Watcher
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this); // 让dep记住Watcher
        }
      }
    }, {
      key: "run",
      value: function run() {
        // 等异步更新的时候来调用此方法
        var value = this.get();
        var oldValue = this.value;
        this.value = value;
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, newVnode) {
    // console.log(oldVnode, vnode);
    // 递归创建新的节点。替换掉老的节点
    // 判断是更新还是要渲染
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 如果不存在说明是要渲染
      var oldElm = oldVnode; // div id = "app"

      var parentElm = oldElm.parentNode; // body

      var el = createElm(newVnode); // 创建元素

      parentElm.insertBefore(el, oldElm.nextSibling); // 插入到老的元素的下一个节点。再把老节点删除，就实现了替换

      parentElm.removeChild(oldElm);
      return el; // 将替换后的节点挂载到 $el上
    } else {
      // dom diff算法。。同层比较 (On^3)
      // 不需要跨级比较
      // 两颗树，要先比较两个根是否一样，再去比较儿子是否一样
      if (oldVnode.tag !== newVnode.tag) {
        // 标签名不一致，说明是两个不一样的节点
        oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el);
      } // 标签一致，或者都是文本


      if (!oldVnode.tag) {
        // 如果是文本，文本变化了。直接用新的文本，替换老的文本
        if (oldVnode.text !== newVnode.text) {
          oldVnode.el.textContent = newVnode.text;
        }
      } // 一定是标签，而且标签一致
      // 标签一致，属性不一致


      var _el = newVnode.el = oldVnode.el;

      updatePropties(newVnode, oldVnode.data); //更新属性 diff属性

      return _el;
    }
  }
  function createElm(vnode) {
    // 根据虚拟节点创建真实的节点
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text; // 是标签就创建标签

    if (typeof tag === 'string') {
      // 如果tag存在，就要创建一个元素
      vnode.el = document.createElement(tag);
      updatePropties(vnode); // 将属性添加到元素上

      children.forEach(function (child) {
        // 递归创建子节点，放到父节点中
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      // 不存在就创建一个文本几万点
      // 虚拟dom上映射着真实dom
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } // 更新属性

  function updatePropties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // 需要比较vnode 和 oldProps的差异
    var newProps = vnode.data || {};
    var el = vnode.el; // 获取老的样式和新的样式的差异，如果新的属性上丢失某个属性，应该删除老的属性

    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        el.style[key] = ''; // 删除之前的样式
      }
    }

    for (var _key in oldProps) {
      if (!newProps[_key]) {
        console.log(el);
        el.removeAttribute(_key); // 如果新的没有属性，则移除老的
      }
    } // 其他情况下，直接用新的值覆盖老的就行


    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        // 将样式属性添加上
        for (var styleName in newProps[_key2]) {
          el.style[styleName] = newProps[_key2][styleName];
        }
      } else if (_key2 === 'class') {
        // class特殊处理
        el.className = newPropsp[_key2];
      } else {
        // 剩下的就直接放上去就行了
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function mountComponent(vm, el) {
    vm.$el = el; // 真实的dom元素

    callHook(vm, 'beforeMount'); // 挂载之前的钩子
    // 渲染页面

    var updateComponent = function updateComponent() {
      // 渲染和更新都会调用此方法
      // 返回的是虚拟DOM，传给update 进行渲染操作
      vm._update(vm._render());
    }; // 渲染Watcher。每个组件都有一个Watcher


    new Watcher(vm, updateComponent, function () {}, true); //true 表示他是一个渲染Watcher

    callHook(vm, 'mounted'); // 挂载结束的钩子

    /* 
      Watcher 就是用来渲染的
      vm._render 通过解析render方法，渲染出虚拟dom
      vm._update 通过虚拟dom,创建真实的dom
     */
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; // 通过虚拟节点，渲染出真实的dom

      vm.$el = patch(vm.$el, vnode); // 需要用虚拟节点创建出真实节点，替换掉原有的$el
    }, Vue.prototype.$forceUpdate = function () {
      var vm = this;

      if (vm._watcher) {
        vm._watcher.update();
      }
    };
  } // 此方法调用传入的生命周期钩子

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (fn) {
        return fn.call(vm);
      }); // 所有的生命周期的this，指向当前实例
    }
  }

  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured', 'serverPrefetch'];
  var strats = {};
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHooks;
  });

  function mergeHooks(parentVal, childVal) {
    // 将生命周期合并为一个数组
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        // 如果已经合并过了就不需要再次合并了
        mergeField(_key);
      }
    } // 默认的合并策略，有些属性需要有特殊的合并策略，比如生命周期，需要合并成一个数组


    function mergeField(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (isObject(parent[key]) && isObject(child[key])) {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (!child[key]) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this; // vue 中使用 this.$options 指代的就是用户传递的属性
      // vm.constuctor 将用户传递的和全局的进行合并

      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate'); // 创建之前
      // 初始化转态

      initState(vm); // 分割代码

      callHook(vm, 'created'); // 创建之后
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
      } // 挂载组件


      mountComponent(vm, el);
    }; // 用户调用的nextTick


    Vue.prototype.$nextTick = nextTick;
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

  // 创建虚拟节点
  var VNode = function VNode(tag, data, children, text) {
    _classCallCheck(this, VNode);

    this.tag = tag;
    this.data = data;
    this.key = data && data.key;
    this.children = children;
    this.text = text;
  };

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return new VNode(tag, data, children, undefined);
  }
  function createTextNode(text) {
    // 创建文本节点
    return new VNode(undefined, undefined, undefined, text);
  } // 虚拟节点，就是通过 _c _v 实现用对象来描述dom的操作
  // 将template 转换成AST语法树 -> 生成render方法 -> 生成虚拟dom -> 生成真实dom
  // 页面更新，重新生成虚拟dom -> diff更新dom

  function renderMinxin(Vue) {
    // 渲染虚拟DOM
    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm); // 去实例化，取值

      return vnode;
    };
    /* 
      _c 创建元素的虚拟节点
      _v 创建文本的虚拟节点
      _s JSON.stringfiy
     */


    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments); //tagm data, children
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      if (!val) {
        return '';
      } else if (_typeof(val) === 'object') {
        return JSON.stringify(val);
      }

      return val;
    };
  }

  function initGlobalAPI(Vue) {
    // 整合了所有的全局API
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
    /*
    Vue.mixin({
      beforeCreate() {
        console.log('mixin1 beforeCreate');
      },
      a: 1
    })
    Vue.mixin({
      beforeCreate() {
        console.log('mixin2 beforeCreate');
      },
      mounted() {
        console.log('mixin mounted');
      },
      b: 2
    }) */
    // 生命周期的合并策略 [beforeCreate, beforeCreate]
    // console.log(Vue.options);

  }

  // Vue核心代码

  function Vue(options) {
    // 进行Vue的初始化操作
    this._init(options);
  }

  initMixin(Vue);
  renderMinxin(Vue);
  lifecycleMixin(Vue); // 初始化全局的API

  initGlobalAPI(Vue); // diff 比较两个树的差异，把前后的DOM渲染在虚拟节点
  var vm1 = new Vue({
    data: {
      name: 'shen'
    }
  });
  var vm2 = new Vue({
    data: {
      name: 'jp'
    }
  });
  var render1 = compileToFunction("<div id=\"b\" c=\"a\">{{ name }}</div>");
  var oldVnode = render1.call(vm1);
  var realElm = createElm(oldVnode);
  document.body.appendChild(realElm);
  var render2 = compileToFunction('<div id="b">{{ name }}</div>');
  var newVnode = render2.call(vm2);
  setTimeout(function () {
    patch(oldVnode, newVnode);
  }, 1000);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
