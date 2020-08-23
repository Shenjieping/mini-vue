import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./scheduler";

let id = 0;
export default class Watcher {
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm;
    this.cb = cb;
    this.id = id++;
    this.options = options;
    this.isRenderWatcher = isRenderWatcher;
    this.depsId = new Set();
    this.deps = [];

    this.getter = expOrFn; // 将内部传过来的函数放在getter属性上
    this.get(); // 调用get方法，会让渲染Watcher执行
  }
  get() {
    // console.log('update'); // 多次调用同一个属性，只更新最后一次
    pushTarget(this); // 将当前的Watcher存起来
    this.getter(); // 执行的就是 vm._update
    popTarget(); // 移除Watcher
  }
  update () {
    // 这里需要等待一起更新，因为每次调用 update 都会存入一个watcher
    // this.get();
    queueWatcher(this); // 先存到一个队列，等同步代码执行完之后再去执行
  }
  addDep (dep) {
    // watcher 不能放重读的dep，同样dep里不能放重复的Watcher
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this); // 让dep记住Watcher
    }
  }
  run () { // 等异步更新的时候来调用此方法
    this.get();
  }
}