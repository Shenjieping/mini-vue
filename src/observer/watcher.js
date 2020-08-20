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