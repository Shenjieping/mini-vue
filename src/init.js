import { initState } from './state';
import { compileToFunction } from './compiler/index';
import { mountComponent, callHook } from './lifecycle';
import { mergeOptions } from './util/options';
// 在原型上添加一个init方法
export function initMixin (Vue) {
  // 初始化流程
  Vue.prototype._init = function(options) {
    // 数据的劫持
    const vm = this;
    // vue 中使用 this.$options 指代的就是用户传递的属性
    // vm.constuctor 将用户传递的和全局的进行合并
    vm.$options = mergeOptions(vm.constructor.options, options);

    console.log(vm.$options);

    callHook(vm, 'beforeCreate'); // 创建之前
    // 初始化转态
    initState(vm); // 分割代码

    callHook(vm, 'created'); // 创建之后

    // 如果用户传入了el属性，需要将页面渲染出来
    // 如果用户传入了el，就要实现挂载的流程
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);

    // 默认会先查找render，没有就会采用 template,在没有就用html
    if (!options.render) {
      // 对模板进行编译
      let template = options.template;
      if (!template && el) { // 使用的html
        template = getOuterHTML(el); // 拿到所有的DOM文档
      }
      // 我们需要将template转换为render方法
      const render = compileToFunction(template);
      options.render = render;
    }

    // 挂载组件
    mountComponent(vm, el);
  }
}

function getOuterHTML (el) { // 获取html元素
  if (el.outerHTML) { // outerHTML 在IE中不兼容
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}