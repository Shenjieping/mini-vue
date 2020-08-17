import { isObject } from "../util/index";

class Observer {
  constructor(value) {
    this.value = value;
    if (Array.isArray(value)) {

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
}

export function defineReactive(obj, key, value) {
  // 递归设置嵌套的对象
  observe(value);
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) { // 设置值的时候做一些操作
      if (value === newValue) {
        return;
      }
      console.log('update 视图更新');
      observe(newValue); // 如果新设置的值是一个对象，也要被监控
      value = newValue;
    }
  })
}

// 用于观测数据，给每个属性添加 get 和 set 方法
export function observe(value) {
  if (!isObject(value)) {
    return;
  }
  return new Observer(value)
}