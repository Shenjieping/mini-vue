let id = 0;
export default class Dep {
  constructor() {
    this.id = id++; // 记录一个唯一的id，用于后面的去重
    this.subs = [];
  }
  depend() {
    // watcher 和 dep 的关系：一个watcher 对应多个depl，一个dep对应多个Watcher，他们之间要互相记录一下
    // this.subs.push(Dep.target); // 观察者模式，这样可能会重复调用
    // 让这个Watcher记住我的dep
    Dep.target.addDep(this);
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
  addSub(watcher) { // 这里放的就是Watcher
    this.subs.push(watcher);
  }
}

let stack = [];
// 目前可以做到将Watcher保存起来，和移除
export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher);
}

export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}