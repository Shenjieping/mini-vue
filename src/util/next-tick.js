let callbacks = []; // 将用户放入的cb,和内部的cb 都存到一个数组中，最后一起更新
let pending = false // 这个队列是否正在等待更新

export function nextTick (cb) {
  callbacks.push(cb);
  if (!pending) {
    setTimeout(flushCallbacks, 0);
    /* 
      这里内部做一层优化，先使用微任务，如果不支持再使用宏任务
        1. 优先使用promise.then，但是在IE低版本中不支持，这里还有一个坑，在IOS的UIwebview中，执行完微任务之后，不会清空队列，需要再执行一下宏任务
        2. 如果promise 不支持，则使用 window.MutationObserver，这个在IE中不支持，并且在IOS中，会有一些诡异的行为，有时不会触发，所以源码也排除了
        3. 如果上面的两个微任务都不支持，则使用宏任务，在宏任务中优先使用 setImmediate，这个只在IE下兼容
        4. 最后以上都不兼容，则降级到 setTimeout
     */
    pending = true; // 如果正在调用，就拦截一下，防止重复执行
  }
}

function flushCallbacks() {
  callbacks.forEach(cb => cb());
  pending = false;
  callbacks = []; // 执行完之后把队列清空
}