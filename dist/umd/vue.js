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

  function initData(vm) {
    // 数据初始化
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持，用户改变了数据，我希望能检测到，从而更新页面
    // MVVM 数据变化可以驱动视图
    // 为了让用户更好的使用，需要将属性直接代理到 vm 上

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

    var renderFn = new Function("with(this){return ".concat(code, "}"));
    console.log(renderFn);
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
