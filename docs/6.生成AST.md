## AST 语法树的生成

1. 创建变量

```js
let root; // 根节点
let stack = []; // 判断是否是闭合标签
let currentParent; // 用来标识当前元素的父节点
const ELEMENT_TYPE = 1; // 元素节点
const TEXT_TYPE = 3; // 文本节点
```

2. 生成树

```js
  function start (tagName, attrs) {
    // 开始标签，创建一个AST元素
    let element = createAstElement(tagName, attrs);
    if (!root) { // 第一次没有root，就生成一个根节点
      root = element;
    }
    currentParent = element; // 把点前元素标记成ast树
    stack.push(element); // 将当前标签存放到栈中
  }

  function chars(text) {
    text = text.trim();
    // 文本节点
    if (text) {
      currentParent.children.push({
        text,
        type: TEXT_TYPE
      });
    }
  }

  function end(tagName) {
    // 结束标签
    let element = stack.pop();
    // 判断标签是否已经闭合，此处暂未考虑自闭合的标签
    if (element.tag !== tagName) {
      throw new TypeError('标签未闭合');
    }
    // 我要标识当前这个元素是属于父元素的
    currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element); // 实现了一个树的父子关系
    }
  }

  function createAstElement(tagName, attrs) {
    // 基本的树结构
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    };
  }
```