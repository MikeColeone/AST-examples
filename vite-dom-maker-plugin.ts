import t from '@babel/types';

export default function domMaker() {
  return {
    visitor: {
      JSXElement(path) {
        const { node } = path;
        
        // 只处理DOM元素（小写标签名）
        if (node.openingElement.name.type === 'JSXIdentifier' && 
            /^[a-z]/.test(node.openingElement.name.name)) {
          
          const openingElement = node.openingElement;
          const closingElement = node.closingElement;
          
          // 获取开始和结束行号
          const startLine = openingElement.loc?.start?.line;
          const endLine = closingElement?.loc?.end?.line || openingElement.loc?.end?.line;
          
          if (!startLine || !endLine) return;
          
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
    }
  };
};


// import type { Plugin } from 'vite';
// import { parse } from '@babel/parser';
// import traverseModule from '@babel/traverse';
// const traverse = traverseModule.default;
// import * as t from '@babel/types';
// import generateModule from '@babel/generator';
// const generate = generateModule.default;

// export default function domMaker(): Plugin {
//   return {
//     name: 'vite-dom-maker-plugin',
//     transform(code, id) {
//     console.log('[vite-dom-maker-plugin] transform:', id);
//     if (!/\.(jsx|tsx)$/.test(id)) return;

//       const ast = parse(code, {
//         sourceType: 'module',
//         plugins: ['jsx', 'typescript'],
//       });

//       traverse(ast, {
//         JSXElement(path) {
//           const { node } = path;
//           // 只处理DOM元素（小写标签名）
//           if (
//             node.openingElement.name.type === 'JSXIdentifier' &&
//             /^[a-z]/.test(node.openingElement.name.name)
//           ) {
//             const openingElement = node.openingElement;
//             const closingElement = node.closingElement;

//             const startLine = openingElement.loc?.start?.line;
//             const endLine = closingElement?.loc?.end?.line || openingElement.loc?.end?.line;

//             if (!startLine || !endLine) return;

//             const hasStartLine = openingElement.attributes.some(
//               attr =>
//                 t.isJSXAttribute(attr) &&
//                 t.isJSXIdentifier(attr.name) &&
//                 attr.name.name === 'data-start-line'
//             );
//             const hasEndLine = openingElement.attributes.some(
//               attr =>
//                 t.isJSXAttribute(attr) &&
//                 t.isJSXIdentifier(attr.name) &&
//                 attr.name.name === 'data-end-line'
//             );

//             if (!hasStartLine) {
//               openingElement.attributes.push(
//                 t.jsxAttribute(
//                   t.jsxIdentifier('data-start-line'),
//                   t.stringLiteral(startLine.toString())
//                 )
//               );
//             }
//             if (!hasEndLine) {
//               openingElement.attributes.push(
//                 t.jsxAttribute(
//                   t.jsxIdentifier('data-end-line'),
//                   t.stringLiteral(endLine.toString())
//                 )
//               );
//             }
//           }
//         },
//       });

//       return generate(ast, { retainLines: true }, code).code;
//     },
//   };
// }