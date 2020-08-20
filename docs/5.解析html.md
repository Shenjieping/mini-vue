## 将HTML循环解析，分别拿到里面的标签名，属性，文本

1. 循环解析html

```js
// 不停的去解析html字符串
while (html) {
  let textEnd = html.indexOf('<'); // 从html < 开始匹配
  if (textEnd === 0) {
    // 如果当前索引为0,肯定是一个标签，可能是开始标签，也可能是结束标签，第一次肯定是开始标签
    let startTagMatch = parseStartTag(); // 通过此方法获取到匹配的结果 tagName attrs
    if (startTagMatch) {
      start(startTagMatch.tagName, startTagMatch.attrs);
      continue; // 如果开始标签匹配完之后，继续下一次匹配
    }
    let endTagMatch = html.match(endTag); // 匹配结尾标签
    if (endTagMatch) { // 如果是结尾标签，则删除
      advance(endTagMatch[0].length);
      end(endTagMatch[1]);
    }
  }
  let text;
  if (textEnd > 0) { // 获取标签内的文本
    text = html.substring(0, textEnd);
    chars(text);
  }
  if (text) { // 如果文本存在，删除文本
    advance(text.length);
  }
}
```

2. 标签标签名，和属性

```js
function parseStartTag () {
  let start = html.match(startTagOpen); // 如果匹配到就是开始标签
  if (start) {
    let match = {
      tagName: start[1], // 标签名
      attrs: [] // 属性
    };
    advance(start[0].length);
    let end, attr;
    // 解析属性，如果不是 > 结束标签，且有属性，则匹配
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      match.attrs.push({
        name: attr[1],
        value: attr[3] || attr[4] || attr[5]
      }); // 将标签和属性保存起来
      advance(attr[0].length); // 将属性去掉
    }
    if (end) {
      // 去掉结束的 >
      advance(end[0].length);
    }
    return match;
  }
}
```
3. 将匹配到的结果删除，再进行下一次循环

```js
// 删除匹配到的结果，不断向前走
function advance(n) {
  html = html.substring(n);
}
```

4. 将获取到的结果进行下一步处理

```js
function start (tagName, attrs) {
  // 开始标签
  console.log('标签，属性', tagName, attrs);
}

function chars(text) {
  // 文本节点
  console.log('文本', text.trim());
}

function end(tagName) {
  // 结束标签
  console.log('结尾', tagName);
}
```

> 源码位置：src/compiler/parser/html-parser.js

