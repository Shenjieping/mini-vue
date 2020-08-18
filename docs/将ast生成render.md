## 将ast语法树生成render函数

> 核心思路就是字符串拼接，循环处理ast树中的每一个子节点

> `src/compiler/codegen.js` 源码位置 `src/compiler/codegen/index.js`

```js
// 获取{{}} 的正则
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function generage (el) {
  // 获取孩子节点
  const children = genChildren(el.children);
  let code = `_c("${el.tag}", ${genProps(el.attrs)}${children ? `,${children}` : ''})`
  return code;
}

// 处理成属性，拼接成字符串
function genProps(attrs) {
  // console.log(attrs)
  if (!attrs.length) { // 如果没有属性就返回undefined
    return undefined;
  }
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') { // 拼接style
      // style="color: red" => {style: {color: 'red'}}
      let obj = {};
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}: ${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

// 处理孩子节点
function genChildren (children) {
  if (children && children.length > 0) {
    // 拿到所有的孩子
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false;
  }
}

function gen (node) {
  if (node.type === 1) { // 元素标签
    return generage(node);
  } else { // 文本
    let text = node.text;
    // 还需要将里面的变量拿出来处理
    // a {{name}} b {{age}} c  => _v("a" + _s(name) + "b" + _s(age) + "c");
    let tockens = [];
    let match, index;
    // 每次匹配的偏移量
    let lastIndex = defaultTagRE.lastIndex = 0;
    // 循环匹配大括号内的变量
    while (match = defaultTagRE.exec(text)) {
      index = match.index;
      // 将第一个文本放进去
      if (index > lastIndex) {
        // 给文本加上双引号，后面解析的时候代表是一个字符串
        tockens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // 变量取出后用 _s 包裹
      tockens.push(`_s(${match[1].trim()})`);
      // 设置偏移量，下次匹配从此处开始
      lastIndex = index + match[0].length;
    }
    // 将最后一个文本放进去
    if (lastIndex < text.length) {
      tockens.push(JSON.stringify(text.slice(lastIndex)));
    }
    return `_v(${tockens.join('+')})`;
  }
}
```

将生成的 code 字符串，生成render函数，此时使用的就是new Function() + with

```js
// console.log(ast);
let code = generage(ast);
// console.log(code);
// 所有的模板引擎实现，都需要用new Fucntion() 和 with
let renderFn = new Function(`with(this){return ${code}}`);

// 后面在调用 renderFn 的时候，传的是什么，这里this，就是传入的值
```