# Vue的初始化

## 创建构造函数

1. 创建Vue实例

vue 在使用的时候都是通过 new Vue 来创建的实例。那么Vue的入口就是一个构造函数。

在src/index.js 中创建一个Vue，并将其导出

```js
// Vue核心代码
import { initMixin } from './init'
function Vue(options) {
  // 进行Vue的初始化操作
  this._init(options);
}

initMixin(Vue);

export default Vue;
```
2. 给Vue原型上添加初始化方法

`initMinxin` 的目的就是给Vue的原型上添加一个 `_init` 方法，用于初始化Vue的options

`src/init.js`
```js
import { initState } from './state';
// 在原型上添加一个init方法
export function initMixin (Vue) {
  // 初始化流程
  Vue.prototype._init = function(options) {
    // 数据的劫持
    const vm = this;
    // vue 中使用 this.$options 指代的就是用户传递的属性
    vm.$options = options;

    // 初始化转态
    initState(vm); // 分割代码
  }
}
```

3. 对options中传入的选项进行初始化 `src/state.js`

判断options中是否有对应的属性，有就进行初始化

初始化data时，先判断是否是函数，如果是函数，则将执行后的结果返回

```js
import { observe } from "./observer/index";
import { proxy } from "./util";

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
```

```js
/**
 * 
 * @param {object} vm 代理的对象
 * @param {string} source 
 * @param {string} key 代理的属性
 */
export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  })
}
```

4. 创建响应式观测文件 `src/observer/index.js`

```js
// 用于观测数据，给每个属性添加 get 和 set 方法
export function observe(value) {
  console.log(value)
}
```

## 总结：

1. 创建Vue构造函数，导出Vue
2. 在原型上添加 _init 方法，用于初始化data
3. 判断options中传入的选项，将其初始化
4. 初始化data时，先判断是否是函数
5. 给data的每一项数据添加 get 和 set 属性，响应式原理