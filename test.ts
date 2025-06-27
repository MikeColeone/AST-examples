import parser from '@babel/parser';
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
import t from '@babel/types';

function addLineDataAttributes(code) {
    console.log(code);
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  traverse(ast, {
    JSXElement(path) {
      const { node } = path;
      
      // 只处理DOM元素（小写标签名）
      if (node.openingElement.name.type === 'JSXIdentifier' && 
          /^[a-z]/.test(node.openingElement.name.name)) {
        
        const openingElement = node.openingElement;
        const closingElement = node.closingElement;
        
        // 获取开始和结束行号
        const startLine = openingElement.loc.start.line;
        const endLine = closingElement ? closingElement.loc.end.line : openingElement.loc.end.line;
        
        // 检查是否已存在这些属性
        const hasStartLine = openingElement.attributes.some(
          attr => attr.name && attr.name.name === 'data-start-line'
        );
        const hasEndLine = openingElement.attributes.some(
          attr => attr.name && attr.name.name === 'data-end-line'
        );
        
        // 添加或更新属性
        if (!hasStartLine) {
          openingElement.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('data-start-line'),
              t.stringLiteral(startLine.toString())
            )
          );
        }
        
        if (!hasEndLine) {
          openingElement.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('data-end-line'),
              t.stringLiteral(endLine.toString())
            )
          );
        }
      }
    }
  });

  const output = generator(ast, {}, code);
  return output.code;
}

// 测试用例
const inputCode = `
import React from 'react';
function MyComponent() {
  return <div>
      <h1>Hello World</h1>
      <p>This is a paragraph with
      multiple lines</p>
    </div>;
}
`;

const outputCode = addLineDataAttributes(inputCode);
console.log(outputCode);