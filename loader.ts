import type { LoaderContext } from "@rspack/core";
import { parse } from "@babel/parser";
import generateModule from "@babel/generator";
const generate = (generateModule as any).default || generateModule;
import t from "@babel/types";
import traverseModule from "@babel/traverse";
const traverse = (traverseModule as any).default || traverseModule;
import path from "path";
export default function domMaker(
  this: LoaderContext<{ root?: string }>,
  source: string
) {
  const options = this.getOptions();
  console.log(typeof options?.root);
  const root = options?.root || process.cwd();
  console.log(root);
  const relPath = path.relative(root, (this as any).resourcePath);
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  traverse(ast, {
    JSXElement(path: any) {
      const { node } = path;
      if (node.openingElement.name.type === "JSXIdentifier") {
        const { openingElement } = node;
        const startLine = openingElement.loc?.start.line;
        const endLine =
          node.closingElement?.loc?.end.line ?? openingElement.loc?.end.line;
        const tagName = openingElement.name.name;
        const hasStart = openingElement.attributes.some(
          (attr: any) =>
            attr.type === "JSXAttribute" && attr.name.name === "data-start-line"
        );
        const hasEnd = openingElement.attributes.some(
          (attr: any) =>
            attr.type === "JSXAttribute" && attr.name.name === "data-end-line"
        );
        const hasTag = openingElement.attributes.some(
          (attr: any) =>
            attr.type === "JSXAttribute" &&
            attr.name.name === "data-component-name"
        );
        const hasFile = openingElement.attributes.some(
          (attr: any) =>
            attr.type === "JSXAttribute" && attr.name.name === "data-file"
        );

        if (!hasStart) {
          openingElement.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier("data-start-line"),
              t.stringLiteral(String(startLine ?? ""))
            )
          );
        }
        if (!hasEnd) {
          openingElement.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier("data-end-line"),
              t.stringLiteral(String(endLine ?? ""))
            )
          );
        }
        if (!hasTag) {
          openingElement.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier("data-component-name"),
              t.stringLiteral(String(tagName ?? ""))
            )
          );
        }
        if (!hasFile) {
          openingElement.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier("data-file"),
              t.stringLiteral(relPath)
            )
          );
        }
      }
    },
  });
  const output = generate(ast, { sourceMaps: true, filename: relPath }, source);
  return output.code;
}
