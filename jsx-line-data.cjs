const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;
const t = require("@babel/types");
const traverse = require("@babel/traverse").default;
const path = require("path");

module.exports = function (source, root = process.cwd()) {
  const relPath = path.relative(root, this.resourcePath);
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    JSXElement(path) {
      const { node } = path;
      let tagName = "";
      if (node.openingElement.name.type === "JSXIdentifier") {
        tagName = node.openingElement.name.name;
      } else if (node.openingElement.name.type === "JSXMemberExpression") {
        let object = node.openingElement.name.object;
        let property = node.openingElement.name.property;
        tagName = `${object.name}.${property.name}`;

        while (object.type === "JSXMemberExpression") {
          property = object.property;
          object = object.object;

          tagName = `${object.name}.${tagName}`;
        }
      } else {
        return;
      }

      const { openingElement } = node;
      const startLine = openingElement.loc?.start.line;
      const endLine =
        node.closingElement?.loc?.end.line ?? openingElement.loc?.end.line;

      const hasStart = openingElement.attributes.some(
        (attr) =>
          attr.type === "JSXAttribute" &&
          attr.name.name === "data-ai-start-line"
      );
      const hasEnd = openingElement.attributes.some(
        (attr) =>
          attr.type === "JSXAttribute" && attr.name.name === "data-ai-end-line"
      );
      const hasTag = openingElement.attributes.some(
        (attr) =>
          attr.type === "JSXAttribute" && attr.name.name === "data-ai-comp-name"
      );
      const hasFile = openingElement.attributes.some(
        (attr) =>
          attr.type === "JSXAttribute" && attr.name.name === "data-ai-file-path"
      );

      if (!hasStart) {
        openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("data-ai-start-line"),
            t.stringLiteral(String(startLine ?? ""))
          )
        );
      }
      if (!hasEnd) {
        openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("data-ai-end-line"),
            t.stringLiteral(String(endLine ?? ""))
          )
        );
      }
      if (!hasTag) {
        openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("data-ai-comp-name"),
            t.stringLiteral(tagName)
          )
        );
      }
      if (!hasFile) {
        openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("data-ai-file-path"),
            t.stringLiteral(relPath)
          )
        );
      }
    },
  });

  const output = generate(ast, { sourceMaps: true, filename: relPath }, source);
  return output.code;
};
