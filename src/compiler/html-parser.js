// 字母a-zA-Z_ - . 数组小写字母 大写字母
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
// ?:匹配不捕获   <aaa:aaa>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// startTagOpen 可以匹配到开始标签 正则捕获到的内容是 (标签名)
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
// 闭合标签 </xxxxxxx>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
// <div aa   =   "123"  bb=123  cc='123'
// 捕获到的是 属性名 和 属性值 arguments[1] || arguments[2] || arguments[2]
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
// <div >   <br/>
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
// 匹配动态变量的  +? 尽可能少匹配
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function parseHTML(html) {
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

  // 删除匹配到的结果，不断向前走
  function advance(n) {
    html = html.substring(n);
  }
}

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