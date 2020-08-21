import { isObject, def } from "../util/index";
import { arrayMethods } from './array';
import Dep from './dep';

class Observer {
  constructor(value) {
    this.value = value;
    // 给当前值，添加一个不可枚举的私有属性，并于传值
    def(value, '__ob__', this); // 这里如果不设置为不可枚举的值，会导致死循环
    if (Array.isArray(value)) {
      // 如果是数组的话。并不会对索引进行观察。因为会导致性能问题
      // 如果数组里放的是对象。我再对里面的对象进行监控
      this.observerArray(value);
      // 我们还需要对 push pop shift unshift splice reverse sort 进行重写
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
  walk(obj) {
    let keys = Object.keys(obj);
    // 循环每一个key，添加get/set
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = obj[key];
      defineReactive(obj, key, value); // 定义响应式数据
    }
  }
  observerArray (items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }
}

export function defineReactive(obj, key, value) {
  let dep = new Dep();

  // 递归设置嵌套的对象
  observe(value);
  Object.defineProperty(obj, key, {
    get() {
      // 每个属性都对应着自己的渲染Watcher
      if (Dep.target) { // 如果当前有Watcher
        dep.depend(); // 我要将Watcher存起来
      }
      return value;
    },
    set(newValue) { // 设置值的时候做一些操作
      if (value === newValue) {
        return;
      }
      // console.log('update 视图更新');
      observe(newValue); // 如果新设置的值是一个对象，也要被监控
      value = newValue;
      dep.notify(); // 通知依赖更新操作
    }
  });

  /* 
    通过Vue源码可以看出，data还可以设置 get/set属性
      如果设置了get，需要先执行函数，拿到返回值再进行处理。为了简化，这里不做这一层的处理
   */
}

// 用于观测数据，给每个属性添加 get 和 set 方法
export function observe(value) {
  if (!isObject(value)) {
    return;
  }
  return new Observer(value);
}