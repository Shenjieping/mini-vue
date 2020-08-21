import { pushTarget, popTarget } from "./dep";

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
    pushTarget(this); // 将当前的Watcher存起来
    this.getter(); // 执行的就是 vm._update
    popTarget(); // 移除Watcher
  }
  update () {
    this.get();
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
}