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

    return el;
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