import { nextTick } from "../util/next-tick";

let queue = [];
let has = {};
export function queueWatcher(watcher) { // 批量更新
  const id = watcher.id;
  if (!has[id]) { // 这里拦截了。每次只能放进去一个值
    queue.push(watcher);
    has[id] = true;
    // 宏任务、微任务（微任务使用了Vue.nextTick, 对异步方法进行封装）
    // Vue.nextTick => promise / mutationObserver / setImmediate / setTimeout 优雅降级的过程
    nextTick(flushSchedulerQueue);
    /*
    setTimeout(() => {
      queue.forEach(watcher => watcher.run())
      queue = []; // 执行完之后将队列清空，下次继续清空
      has = {};
    }, 0); */
  }
}

function flushSchedulerQueue() {
  queue.forEach(watcher => watcher.run())
  queue = []; // 执行完之后将队列清空，下次继续清空
  has = {};
}