import { mergeOptions } from "../util/options";

export function initGlobalAPI(Vue) {
  // 整合了所有的全局API
  Vue.options = {};
  Vue.mixin = function(mixin) {
    this.options = mergeOptions(this.options, mixin);
  }

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