
import type { Plugin } from 'vite';
import swcCore from '@swc/core';
const { transformSync, Visitor } = swcCore;

class AddLineAttrVisitor extends Visitor {
  visitJSXElement(n) {
    n = super.visitJSXElement(n);

    // 只处理 Identifier 类型标签
    if (
      n.opening &&
      n.opening.name &&
      n.opening.name.type === 'Identifier'
    ) {
      const attrs = n.opening.attributes || [];
      const startLine = n.opening.span.start.line;
      const endLine = n.closing
        ? n.closing.span.end.line
        : n.opening.span.end.line;

      // 检查是否已存在
      const hasStart = attrs.some(
        (a) =>
          a.type === 'JSXAttribute' &&
          a.name.type === 'Identifier' &&
          a.name.value === 'data-start-line'
      );
      const hasEnd = attrs.some(
        (a) =>
          a.type === 'JSXAttribute' &&
          a.name.type === 'Identifier' &&
          a.name.value === 'data-end-line'
      );

      if (!hasStart) {
        attrs.push({
          type: 'JSXAttribute',
          span: n.opening.span,
          name: { type: 'Identifier', value: 'data-start-line', span: n.opening.span },
          value: {
            type: 'StringLiteral',
            span: n.opening.span,
            value: String(startLine),
            hasEscape: false,
          },
        });
      }
      if (!hasEnd) {
        attrs.push({
          type: 'JSXAttribute',
          span: n.opening.span,
          name: { type: 'Identifier', value: 'data-end-line', span: n.opening.span },
          value: {
            type: 'StringLiteral',
            span: n.opening.span,
            value: String(endLine),
            hasEscape: false,
          },
        });
      }
      n.opening.attributes = attrs;
    }
    return n;
  }
}

export default function domMaker(): Plugin {
  return {
    name: 'vite-dom-maker-plugin-swc',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.(jsx|tsx)$/.test(id)) return;

      const t0 = performance.now();
      const result = transformSync(code, {
        filename: id,
        jsc: {
          parser: {
            syntax: id.endsWith('.tsx') ? 'typescript' : 'ecmascript',
            tsx: true,
            decorators: false,
          },
        },
        plugin: (m) => new AddLineAttrVisitor().visitProgram(m),
        sourceMaps: false,
      });
      const t1 = performance.now();
      console.log('JSXElement modify耗时(ms):', t1 - t0);

      return {
        code: result.code,
        map: null,
      };
    },
  };
}


