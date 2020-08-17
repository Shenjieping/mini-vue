import { parseHTML } from './html-parser';

/* 
  ast 语法树 -> 用对象来描述原生的语法
  虚拟DOM -> 用对象来描述DOM节点
 */
export function compileToFunction(template) {
  const ast = parseHTML(template);
  return function render() {}
}

/* 
  <div id="app">
    <p>test</p>
  </div>

  AST语法树, 用一种抽象的语法来描述原生的HTML结构
  let root = {
    tag: 'div',
    attrs: [{name: 'id', value: 'app'}],
    type: 1,
    children: [{
      tag: 'p',
      attrs: [],
      type: 1,
      children: [{
        type: 3,
        text: 'test'
      }]
    }]
  }
 */