/**
 * @param {any} obj 需要判断的对象
 * @returns {boolean}
 */
export function isObject(obj) {
  return obj && typeof obj === 'object';
}

/**
 * 给某个对象设置私有属性
 * @param {Object} obj 需要添加的对象
 * @param {string} key 属性
 * @param {any} val 值
 * @param {boolean} enumerable 是否可枚举
 */
export function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}