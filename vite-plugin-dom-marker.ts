import type { Plugin } from 'vite';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = traverseModule.default;
import * as t from '@babel/types';
import generateModule from '@babel/generator';
const generate = generateModule.default;
// ...existing code...
// console.log('================')
export default function vitePluginDomMarker(): Plugin {
  // console.log('vitePluginDomMarker plugin loaded');
  return {
    name: 'vite-plugin-dom-marker',
    
    transform(code, id) {
      // console.log('vitePluginDomMarker plugin loaded')
      if (!/\.(jsx|tsx)$/.test(id)) return;

      try {
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
          tokens: true,
          ranges: true,
        });
        // console.log(ast);
        traverse(ast, {
          JSXElement(path) {
            console.log('JSXElement', path.node);
            const { openingElement, closingElement } = path.node;
            const startLine = openingElement.loc?.start.line;
            const endLine = closingElement?.loc?.end.line || openingElement.loc?.end.line;
            console.log('startLine', startLine, endLine);
            if (!startLine) return;

            // 添加起始行属性
            if (!hasAttribute(openingElement, 'data-start-line')) {
              openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('data-start-line'),
                  t.stringLiteral(String(startLine))
                )
              );
            }

            // 添加结束行属性（如果存在闭合标签）
            if (endLine && !hasAttribute(openingElement, 'data-end-line')) {
              openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('data-end-line'),
                  t.stringLiteral(String(endLine))
                )
              );
            }
          },
          JSXFragment(path) {
            const { openingFragment, closingFragment } = path.node;
            const startLine = openingFragment.loc?.start.line;
            const endLine = closingFragment?.loc?.end.line;

            if (!startLine || !endLine) return;

            // 将 Fragment 转换为带标记的 div
            path.replaceWith(
              t.jsxElement(
                t.jsxOpeningElement(
                  t.jsxIdentifier('div'),
                  [
                    t.jsxAttribute(
                      t.jsxIdentifier('data-start-line'),
                      t.stringLiteral(String(startLine))
                    ),
                    t.jsxAttribute(
                      t.jsxIdentifier('data-end-line'),
                      t.stringLiteral(String(endLine))
                    ),
                  ],
                  false
                ),
                t.jsxClosingElement(t.jsxIdentifier('div')),
                path.node.children,
                false
              )
            );
          },
        });

        return generate(ast, { retainLines: true }, code).code;
      } catch (e) {
        console.error(`Error processing ${id}:`, e);
        return code; // 出错时返回原始代码
      }
    },
  };
}

// // 检查属性是否存在
// function hasAttribute(element: t.JSXOpeningElement, name: string) {
//   console.log('hasAttribute', element, name);
//   return element.attributes.some(
//     attr => t.isJSXAttribute(attr) && 
//             t.isJSXIdentifier(attr.name) && 
//             attr.name.name === name
//   );
// }




// const parser = require('@babel/parser');
// const traverse = require('@babel/traverse').default;
// const generator = require('@babel/generator').default;
// const t = require('@babel/types');

// function addLineDataAttributes(code) {
//   const ast = parser.parse(code, {
//     sourceType: 'module',
//     plugins: ['jsx']
//   });

//   traverse(ast, {
//     JSXElement(path) {
//       const { node } = path;
      
//       // 只处理DOM元素（小写标签名）
//       if (node.openingElement.name.type === 'JSXIdentifier' && 
//           /^[a-z]/.test(node.openingElement.name.name)) {
        
//         const openingElement = node.openingElement;
//         const closingElement = node.closingElement;
        
//         // 获取开始和结束行号
//         const startLine = openingElement.loc.start.line;
//         const endLine = closingElement ? closingElement.loc.end.line : openingElement.loc.end.line;
        
//         // 检查是否已存在这些属性
//         const hasStartLine = openingElement.attributes.some(
//           attr => attr.name && attr.name.name === 'data-start-line'
//         );
//         const hasEndLine = openingElement.attributes.some(
//           attr => attr.name && attr.name.name === 'data-end-line'
//         );
        
//         // 添加或更新属性
//         if (!hasStartLine) {
//           openingElement.attributes.push(
//             t.jsxAttribute(
//               t.jsxIdentifier('data-start-line'),
//               t.stringLiteral(startLine.toString())
//             )
//           );
//         }
        
//         if (!hasEndLine) {
//           openingElement.attributes.push(
//             t.jsxAttribute(
//               t.jsxIdentifier('data-end-line'),
//               t.stringLiteral(endLine.toString())
//             )
//           );
//         }
//       }
//     }
//   });

//   const output = generator(ast, {}, code);
//   return output.code;
// }

// // 测试用例
// const inputCode = `
// import React from 'react';
// function MyComponent() {
//   return <div>
//       <h1>Hello World</h1>
//       <p>This is a paragraph with
//       multiple lines</p>
//     </div>;
// }
// `;

// const outputCode = addLineDataAttributes(inputCode);
// console.log(outputCode);