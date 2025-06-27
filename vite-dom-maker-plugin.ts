import t from '@babel/types';


let start = 0;
export default function domMaker() {
  return {
    visitor: {
        Program: {
        enter() {
          start = performance.now();
        },
        exit() {
          const end = performance.now();
          console.log('JSXElement modify耗时(ms):', end - start);
        }
      },
      JSXElement(path) {
        const { node } = path;
        if (node.openingElement.name.type === 'JSXIdentifier' && 
            /^[a-zA-Z]/.test(node.openingElement.name.name)) {
          
          const openingElement = node.openingElement;
          const closingElement = node.closingElement;
          console.log('openingElement', openingElement);
          // 获取开始和结束行号
          const startLine = openingElement.loc?.start?.line;
          console.log(startLine)
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

