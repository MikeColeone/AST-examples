import type { Plugin } from 'vite';
import { parse } from '@babel/parser';
import generateModule from '@babel/generator';
const generate = (generateModule as any).default || generateModule;
import t from '@babel/types';
import traverseModule from '@babel/traverse';
const traverse = (traverseModule as any).default || traverseModule;
interface Options {
  enabled?: boolean;
  logPerf?: boolean;
}

export default function vitePluginJsxLines(options: Options = {}): Plugin {
  const { enabled = true, logPerf = true } = options;

  return {
    name: 'vite-plugin',
    enforce: 'pre',

    async transform(code, id) {
      if (!enabled) return;
      if (!/\.(jsx|tsx)$/.test(id)) return;
      console.log(`[vite-plugin] 正在处理文件: ${id}`);
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
            const { openingElement } = node;
            const startLine = openingElement.loc?.start.line;
            const endLine = node.closingElement?.loc?.end.line ?? openingElement.loc?.end.line;
            const tagName = openingElement.name.name;

            // 检查属性是否已存在
            const hasStart = openingElement.attributes.some(attr =>
              attr.type === 'JSXAttribute' && attr.name.name === 'data-start-line'
            );
            const hasEnd = openingElement.attributes.some(attr =>
              attr.type === 'JSXAttribute' && attr.name.name === 'data-end-line'
            );
            const hasTag = openingElement.attributes.some(attr =>
              attr.type === 'JSXAttribute' && attr.name.name === 'data-component'
            );
            const hasFile = openingElement.attributes.some(attr =>
              attr.type === 'JSXAttribute' && attr.name.name === 'data-file'
            );

            if (!hasStart) {
              openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('data-start-line'),
                  t.stringLiteral(String(startLine ?? ''))
                )
              );
            }

            if (!hasEnd) {
              openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('data-end-line'),
                  t.stringLiteral(String(endLine ?? ''))
                )
              );
            }

            if (!hasTag) {
              openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('data-component'),
                  t.stringLiteral(tagName)
                )
              );
            }

            if (!hasFile) {
              openingElement.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('data-file'),
                  t.stringLiteral(id)
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
          `[vite-plugin] 转换耗时: ${(end - startTime).toFixed(2)}ms`
        );
      }

      return {
        code: output.code,
        map: output.map,
      };
    },
  };
}