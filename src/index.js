// Vue核心代码
import { initMixin } from './init';
import { renderMinxin } from './render';
import { lifecycleMixin } from './lifecycle';

function Vue(options) {
  // 进行Vue的初始化操作
  this._init(options);
}

initMixin(Vue);
renderMinxin(Vue);
lifecycleMixin(Vue);

export default Vue;