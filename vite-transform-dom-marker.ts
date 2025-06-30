import type { Plugin } from 'vite';
import { transform } from '@babel/core';
import t from '@babel/types';
// @ts-expect-error: No type definitions available for '@babel/plugin-syntax-jsx'
import jsxSyntax from '@babel/plugin-syntax-jsx';
// @ts-expect-error: No type definitions available for '@babel/plugin-syntax-jsx'
import tsSyntax from '@babel/plugin-syntax-typescript';
import type { PluginItem } from '@babel/core';

interface Options {
  enabled?: boolean; 
  logPerf?: boolean; 
}

export default function vitePluginJsxLines(options: Options = {}): Plugin {
  const { enabled = true, logPerf = true } = options;
  
  const domMaker = (): PluginItem => ({
    name: 'jsx-line-attributes',
    visitor: {
      Program: {
        enter() {
          console.log('Program enter');
          if (logPerf) this.start = performance.now();
        },
        exit() {
          console.log("Program exit")
          if (logPerf && this.start) {
            console.log("Program exit")
            const end = performance.now();
            console.log(`[vite-plugin-jsx-lines] 转换耗时: ${(end - this.start).toFixed(2)}ms`);
          }
        }
      },
      JSXElement(path) {
        const { node } = path;
        const openingElement = node.openingElement;
        
        if (openingElement.name.type === 'JSXIdentifier') {
          
          const closingElement = node.closingElement;
          const startLine = openingElement.loc?.start.line;
          const endLine = closingElement?.loc?.end.line || openingElement.loc?.end.line;
          
          if (!startLine || !endLine) return;
          
          const attributes = openingElement.attributes;
          const hasStart = attributes.some(a => 
            a.type === 'JSXAttribute' && a.name.name === 'data-start-line'
          );
          const hasEnd = attributes.some(a => 
            a.type === 'JSXAttribute' && a.name.name === 'data-end-line'
          );
          
          if (!hasStart) {
            attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('data-start-line'),
                t.stringLiteral(startLine.toString())
              )
            );
          }
          
          if (!hasEnd) {
            attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('data-end-line'),
                t.stringLiteral(endLine.toString())
              )
            );
          }
        }
      }
    }
  });

  return {
    name: 'vite-plugin-jsx-lines',
    //防止被react（）插件提前转译
    enforce: 'pre', 
    
    async transform(code, id) {
      console.log('[vite-plugin-jsx-lines] transform', id);
      if (!enabled) return;
      if (!/\.(jsx|tsx)$/.test(id)) return;
      
      try {
        const result = await transform(code, {
          plugins: [
            [jsxSyntax, { isTSX: true }],
            [tsSyntax, { isTSX: true }],
            domMaker(),
          ],
          filename: id,
          ast: true,
          sourceMaps: true,
          configFile: false,
        });
        
        return result 
          ? { code: result.code || '', map: result.map } 
          : undefined;
      } catch (e) {
        console.error(`[vite-plugin-jsx-lines] 处理 ${id} 时出错:`, e);
      }
    }
  };
}