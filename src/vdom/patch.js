export function patch(oldVnode, newVnode) {
  // console.log(oldVnode, vnode);
  // 递归创建新的节点。替换掉老的节点
  // 判断是更新还是要渲染
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) { // 如果不存在说明是要渲染
    const oldElm = oldVnode; // div id = "app"
    const parentElm = oldElm.parentNode; // body

    let el = createElm(newVnode); // 创建元素
    parentElm.insertBefore(el, oldElm.nextSibling); // 插入到老的元素的下一个节点。再把老节点删除，就实现了替换
    parentElm.removeChild(oldElm);
    return el; // 将替换后的节点挂载到 $el上
  } else {
    // dom diff算法。。同层比较 (On^3)
    // 不需要跨级比较
    // 两颗树，要先比较两个根是否一样，再去比较儿子是否一样
    
    if (oldVnode.tag !== newVnode.tag) { // 标签名不一致，说明是两个不一样的节点
      oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el);
    }
    // 标签一致，或者都是文本
    if (!oldVnode.tag) { // 如果是文本，文本变化了。直接用新的文本，替换老的文本
      if (oldVnode.text !== newVnode.text) {
        oldVnode.el.textContent = newVnode.text;
      }
    }

    // 一定是标签，而且标签一致
    // 标签一致，属性不一致
    let el = newVnode.el = oldVnode.el;
    updatePropties(newVnode, oldVnode.data) //更新属性 diff属性

    // 比对孩子节点
    let oldChildren = oldVnode.children || []; // 老的孩子
    let newChildren = newVnode.children || []; // 新的孩子
    // 新老都有孩子，那就比较
    // 新的有孩子，老的没孩子，直接插入
    // 新的没孩子，老的有孩子，直接删除
    if (oldChildren.length > 0 && newChildren.length > 0) {
      // diff
      updateChildren(el, oldChildren, newChildren);
    } else if (oldChildren.length > 0) {
      el.innerHTML = '';
    } else {
      for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        el.appendChild(createElm(child));
      }
    }

    return el;
  }
}

function sameVnode(oldVnode, newVnode) {
  return (oldVnode.key === newVnode.key) && (oldVnode.tag === oldVnode.tag);
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (key) map[key] = i
  }
  return map
}

function updateChildren (parent, oldChildren, newChildren) {
  // vue 2.0 使用双指针的方式进行比对
  // v-for 要有key，key可以标识元素是否发生变化，前后的key相同则可以复用当前元素
  let oldStartIndex = 0; // 老的开始索引
  let oldStartVnode = oldChildren[0]; // 老的开始元素
  let oldEndIndex = oldChildren.length - 1; // 老的尾部索引
  let oldEndVnode = oldChildren[oldEndIndex]; // 获取老的最后一个

  let newStartIndex = 0; // 新的开始索引
  let newStartVnode = newChildren[0]; // 新的开始元素
  let newEndIndex = newChildren.length - 1; // 新的尾部索引
  let newEndVnode = newChildren[newEndIndex]; // 获取新的最后一个

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) { // 采用最短的进行比较，剩下的要不删除要么增加
    // 如果元素的指针在移动的时候，遇到了null，则跳过当前元素
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    } else if (sameVnode(oldStartVnode, newStartVnode)) { // 如果type和key一致，那就是同一个元素
      // 方案1：先开始从头部开始比较，如果头部一致，则开始比较
      // 标签和key一致，但是可能属性不一致
      /* 
        A  B  C  D
        A  B  C  D  E
       */
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex]; // 指针不停的向后移动，再进行比较
      newStartVnode = newChildren[++newStartIndex];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 方案2，从尾部开始比较，如果头部不一样，开始尾部比较，优化向前插入
      /* 
          A  B  C  D
        E A  B  C  D
       */
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex]; // 移动尾部指针
      newEndVnode = newChildren[--newEndIndex];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 方案3 头不一样，尾不一样，头移位（正序，倒叙）
      /* 
        A  B  C  D  -> 头和尾比较，如果一样，将当前元素插入到最后一个元素的下一个
        D  C  B  A
       */
      patch(oldStartVnode, newEndVnode);
      // 将头部元素插入到最后
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 方案4 头和头不一样，尾和尾不一样，头和尾不一样，但是尾和头一样
      /* 
        A  B  C  D
        D  A  B  C
       */
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else {
      // 乱序
      /* 
        A  B  C  D
        C  D  M  E
       */
      let map = createKeyToOldIdx(oldChildren, oldStartIndex, oldEndIndex); // 根据老的孩子的key，创建一个映射表
      let moveIndex = map[newStartVnode.key];
      if (!moveIndex) {
        // 当前元素不存在,是一个新元素，添加到前面
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        // 找到了索引
        let moveVnode = oldChildren[moveIndex];
        oldChildren[moveIndex] = null; // 如果直接删除，可能会导致数组塌陷，下次查找不方便
        patch(moveVnode, newStartVnode); // 比对当前这两个元素的属性和儿子
        parent.insertBefore(moveVnode.el, oldStartVnode.el); // 将当前元素插入到开始
      }
      newStartVnode = newChildren[++newStartIndex];

    }
  }
  if (newStartIndex <= newEndIndex) { // 如果指针移动完成之后，还有新的元素，则把剩下的新的元素插入到老的元素中
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // parent.appendChild(createElm(newChildren[i]));
      // 判断插入的位置
      let ele = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null;
      parent.insertBefore(createElm(newChildren[i]), ele);
    }
  }

  // 如果还有剩下的，全部删除
  if (oldStartIndex <= oldEndIndex) {
    // 说明新的已经循环完毕了，老的有剩余，那就不要了
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i];
      if (child) {
        parent.removeChild(child.el);
      }
    }
  }
}

export function createElm(vnode) {
  // 根据虚拟节点创建真实的节点
  const { tag, children, key, data, text } = vnode;
  // 是标签就创建标签
  if (typeof tag === 'string') { // 如果tag存在，就要创建一个元素
    vnode.el = document.createElement(tag);
    updatePropties(vnode) // 将属性添加到元素上
    children.forEach(child => {
      // 递归创建子节点，放到父节点中
      return vnode.el.appendChild(createElm(child));
    })
  } else { // 不存在就创建一个文本几万点
    // 虚拟dom上映射着真实dom
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 更新属性
function  updatePropties(vnode, oldProps = {}) {

  // 需要比较vnode 和 oldProps的差异

  let newProps = vnode.data || {};
  let el = vnode.el;
  // 获取老的样式和新的样式的差异，如果新的属性上丢失某个属性，应该删除老的属性
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};

  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''; // 删除之前的样式
    }
  }

  for (let key in oldProps) {
    if (!newProps[key]) {
      console.log(el);
      el.removeAttribute(key); // 如果新的没有属性，则移除老的
    }
  }
  // 其他情况下，直接用新的值覆盖老的就行
  for(let key in newProps) {
    if (key === 'style') { // 将样式属性添加上
      for(let styleName in newProps[key]) {
        el.style[styleName] = newProps[key][styleName];
      }
    } else if (key === 'class') { // class特殊处理
      el.className = newPropsp[key];
    } else { // 剩下的就直接放上去就行了
      el.setAttribute(key, newProps[key]);
    }
  }
}