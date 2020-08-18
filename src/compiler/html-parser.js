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
  let root; // 根节点
  let stack = []; // 判断是否是闭合标签
  let currentParent; // 用来标识当前元素的父节点
  const ELEMENT_TYPE = 1; // 元素节点
  const TEXT_TYPE = 3; // 文本节点

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

  return root;
}