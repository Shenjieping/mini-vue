/* 
  我们要对数组的 7 个方法进行重写：
    push, pop, shift, unshift, reverse, sort, splice
  因为这7个方法会改变原数组
 */

const arrayProto = Array.prototype;
// 原型链查找，会向上查找，先查找我们重写的，如果没有再向上查找原型链上的
export const arrayMethods = Object.create(arrayProto); // 拷贝原型上的方法，防止我们的代码破坏了原型链

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

methodsToPatch.forEach(method => {
  arrayMethods[method] = function(...args) {
    // 调用我们的方法后。又去调用了原生的方法
    const result = arrayProto[method].apply(this, args);
    let ob = this.__ob__; // 将实例上的方法传过来
    // push shift splice 添加的值可能还是一个对象
    let inserted; // 保存当前用户插入的元素
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
  }
});
