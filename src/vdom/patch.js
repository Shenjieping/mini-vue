export function patch(oldVnode, vnode) {
  // console.log(oldVnode, vnode);
  // 递归创建新的节点。替换掉老的节点
  // 判断是更新还是要渲染
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) { // 如果不存在说明是要渲染
    const oldElm = oldVnode; // div id = "app"
    const parentElm = oldElm.parentNode; // body

    let el = createElm(vnode); // 创建元素
    parentElm.insertBefore(el, oldElm.nextSibling); // 插入到老的元素的下一个节点。再把老节点删除，就实现了替换
    parentElm.removeChild(oldElm);
    return el; // 将替换后的节点挂载到 $el上
  }
}

function createElm(vnode) {
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
function  updatePropties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el;
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