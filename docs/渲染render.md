## 渲染页面的过程

> 将element转换成ast语法树 -> 生成render方法 -> 生成虚拟dom -> 生成真实dom

1. 挂载组件，创建lifecycle.js 文件

```js
import Watcher from "./observer/watcher";
import { patch } from './vdom/patch'

export function mountComponent(vm, el) {
  vm.$el = el; // 真实的dom元素
  // 渲染页面
  let updateComponent = () => { // 渲染和更新都会调用此方法
    // 返回的是虚拟DOM，传给update 进行渲染操作
    vm._update(vm._render());
  }
  // 渲染Watcher。每个组件都有一个Watcher
  new Watcher(vm, updateComponent, () => {}, true); //true 表示他是一个渲染Watcher

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
```

2. 在render.js中创建 _c, _v, _s 用于解析元素，文本，变量。

```js
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
```

3. 在 vdom/create-element.js 中，主要是用于生成虚拟dom

```js
import VNode from './vnode';

export function createElement(tag, data = {}, ...children) {
  return new VNode(tag, data, children, undefined);
}

export function createTextNode(text) {
  // 创建文本节点
  return new VNode(undefined, undefined, undefined, text);
}

// vnode.js
// 创建虚拟节点
export default class VNode {
  constructor(tag, data, children, text) {
    this.tag = tag;
    this.data = data;
    this.key = data && data.key;
    this.children = children;
    this.text = text;
  }
}
```

4. 将vnode转换为真实dom，并渲染到页面中 vdom/patch.js

```js
export function patch(oldVnode, vnode) {
  // console.log(oldVnode, vnode);
  // 递归创建新的节点。替换掉老的节点
  // 判断是更新还是要渲染
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) { // 如果不存在说明是要渲染
    const oldElm = oldVnode; // div id = "app"
    const parentElm = oldElm.parentNode; // body

    let el = createElm(vnode); // 创建元素
    parentElm.insertBefore(el, oldElm.nextSibling); // 插入到老的元素的下一个节点。再把老节点删除，就实现了替换
    parentElm.removeChild(oldElm);
    return el; // 将替换后的节点挂载到 $el上
  }
}

function createElm(vnode) {
  // 根据虚拟节点创建真实的节点
  const { tag, children, key, data, text } = vnode;
  // 是标签就创建标签
  if (typeof tag === 'string') { // 如果tag存在，就要创建一个元素
    vnode.el = document.createElement(tag);
    updatePropties(vnode) // 将属性添加到元素上
    children.forEach(child => {
      // 递归创建子节点，放到父节点中
      return vnode.el.appendChild(createElm(child));
    })
  } else { // 不存在就创建一个文本几万点
    // 虚拟dom上映射着真实dom
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 更新属性
function  updatePropties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el;
  for(let key in newProps) {
    if (key === 'style') { // 将样式属性添加上
      for(let styleName in newProps[key]) {
        el.style[styleName] = newProps[key][styleName];
      }
    } else if (key === 'class') { // class特殊处理
      el.className = newPropsp[key];
    } else { // 剩下的就直接放上去就行了
      el.setAttribute(key, newProps[key]);
    }
  }
}
```

5. 在 `observer/watcher.js` 中调用更新方法，实现渲染

```js
export default class Watcher {
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;
    this.cb = cb;
    this.options = options;
    this.isRenderWatcher = isRenderWatcher;

    this.getter = expOrFn; // 将内部传过来的函数放在getter属性上
    this.get();
  }
  get() {
    this.getter(); // 执行的就是 vm._update
  }
}
```

## 总结

1. 创建生命周期，挂载组件
2. 解析render，生成vdom
3. 将vdom生成真实的dom，挂载到页面中