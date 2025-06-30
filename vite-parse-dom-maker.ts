import type { Plugin } from 'vite';
import { parse } from '@babel/parser';
import generateModule from '@babel/generator';
const generate = (generateModule as any).default || generateModule;
import t from '@babel/types';
import traverseModule from '@babel/traverse';
const traverse = (traverseModule as any).default || traverseModule;
interface Options {
  enabled?: boolean; // 是否启用插件（默认 true）
  logPerf?: boolean; // 是否记录性能（默认 false）
}

export default function vitePluginJsxLines(options: Options = {}): Plugin {
  const { enabled = true, logPerf = true } = options;

  return {
    name: 'vite-plugin-jsx-lines',
    enforce: 'pre',

    async transform(code, id) {
      if (!enabled) return;
      if (!/\.(jsx|tsx)$/.test(id)) return;

      let startTime = 0;
      if (logPerf) startTime = performance.now();

      const ast = parse(code, {
        sourceType: 'module',
        plugins: [
          'jsx',
          'typescript',
        ],
      });

      traverse(ast, {
        JSXElement(path) {
          const { node } = path;
          if (node.openingElement.name.type === 'JSXIdentifier') {
            const openingElement = node.openingElement;
            const closingElement = node.closingElement;
            const startLine = openingElement?.loc?.start.line;
            const endLine = closingElement
              ? closingElement?.loc?.end.line
              : openingElement?.loc?.end.line;

            const hasStartLine = openingElement.attributes.some(
              attr =>
                attr.type === 'JSXAttribute' &&
                attr.name &&
                attr.name.name === 'data-start-line'
            );
            const hasEndLine = openingElement.attributes.some(
              attr =>
                attr.type === 'JSXAttribute' &&
                attr.name &&
                attr.name.name === 'data-end-line'
            );

            if (!hasStartLine) {
              openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('data-start-line'),
                  t.stringLiteral(
                    startLine !== undefined ? startLine.toString() : ''
                  )
                )
              );
            }

            if (!hasEndLine) {
              openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('data-end-line'),
                  t.stringLiteral(
                    endLine !== undefined ? endLine.toString() : ''
                  )
                )
              );
            }
          }
        },
      });

      const output = generate(ast, { sourceMaps: true, filename: id }, code);

      if (logPerf) {
        const end = performance.now();
        console.log(
          `[vite-plugin-jsx-lines] 转换耗时: ${(end - startTime).toFixed(2)}ms`
        );
      }

      return {
        code: output.code,
        map: output.map,
      };
    },
  };
}