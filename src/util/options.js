export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
]

let strats = {};
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHooks;
});


function mergeHooks(parentVal, childVal) { // 将生命周期合并为一个数组
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

export function mergeOptions(parent, child) {
  const options = {};

  for (let key in parent) {
    mergeField(key);
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) { // 如果已经合并过了就不需要再次合并了
      mergeField(key);
    }
  }

  // 默认的合并策略，有些属性需要有特殊的合并策略，比如生命周期，需要合并成一个数组
  function mergeField(key) {
    if (strats[key]) {
      return options[key] = strats[key](parent[key], child[key]);
    }
    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key]
      };
    } else if (!child[key]) {
      options[key] = parent[key];
    } else {
      options[key] = child[key];
    }
  }
  return options;
}
