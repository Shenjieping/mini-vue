import { parseHTML } from './html-parser';
import { generage } from './codegen';

/* 
  ast 语法树 -> 用对象来描述原生的语法
  虚拟DOM -> 用对象来描述DOM节点
 */
export function compileToFunction(template) {
  // 解析HTML字符串，变成AST语法树
  const ast = parseHTML(template);
  // 需要将AST树转为render函数，其实就是字符串拼接
  // 核心思路就是，将模板转换为一下的字符串
  // <div id="app"><p>hello {{ name }}</p>{{ age }}</div>
  // 将AST转为js方法
  // _c('div', {id: app}, _c('p', undefined, _v('hello' + _s(name))), _s(age))
  // console.log(ast);
  let code = generage(ast);
  // console.log(code);
  // 所有的模板引擎实现，都需要用new Fucntion() 和 with
  let renderFn = new Function(`with(this){return ${code}}`);
  console.log(renderFn);
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