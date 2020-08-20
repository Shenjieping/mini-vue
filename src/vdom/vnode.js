// 创建虚拟节点
export default class VNode {
  constructor(tag, data, children, text) {
    this.tag = tag;
    this.data = data;
    this.key = data && data.key;
    this.children = children;
    this.text = text;
  }
}
