// Vue核心代码
import { initMixin } from './init';
import { renderMinxin } from './render';
import { lifecycleMixin } from './lifecycle';
import { initGlobalAPI } from './initGlobalAPI/index';

function Vue(options) {
  // 进行Vue的初始化操作
  this._init(options);
}

initMixin(Vue);
renderMinxin(Vue);
lifecycleMixin(Vue);

// 初始化全局的API
initGlobalAPI(Vue);

// diff 比较两个树的差异，把前后的DOM渲染在虚拟节点
import { compileToFunction } from './compiler/index';
import { createElm, patch } from './vdom/patch'

let vm1 = new Vue({data: {name: 'shen'}});
let vm2 = new Vue({data: {name: 'jp'}});
let render1 = compileToFunction(`<div id="b" c="a">{{ name }}</div>`);
let oldVnode = render1.call(vm1);

let realElm = createElm(oldVnode);
document.body.appendChild(realElm);

let render2 = compileToFunction('<div id="b">{{ name }}</div>');
let newVnode = render2.call(vm2);
setTimeout(() => {
  patch(oldVnode, newVnode);
}, 1000);



export default Vue;