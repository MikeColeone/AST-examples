const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const libs = [
  "antd",
  "antd-mobile",
  "@ant-design",
  "@material-ui",
  "element-ui",
];
console.log("===========")
class AiTagInjectorPlugin {
  constructor(options = {}) {
    this.options = options;
    this.libs = options.libs || libs;
  }

  apply(compiler) {
    console.log("jjjjjjjjjjjjjj")
    compiler.hooks.compilation.tap("AiTagInjectorPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "AiTagInjectorPlugin",
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
        },
        (assets) => {
          const excludedComponents = new Set();
            console.log("白名单")
            console.log(assets)
          for (const assetName in assets) {
            if (!assetName.endsWith(".js") && !assetName.endsWith(".jsx") && !assetName.endsWith(".tsx")) continue;

            const asset = compilation.getAsset(assetName);
            const rawSource = asset.source.source();

            try {
              const ast = parse(rawSource, {
                sourceType: "module",
                plugins: ["jsx", "typescript"],
              });

              const relPath = path.relative(compiler.context, assetName);

              traverse(ast, {
                ImportDeclaration(path) {
                  const sourceValue = path.node.source.value;
                    
                  this.libs.forEach((lib) => {
                    if (sourceValue.startsWith(lib)) {
                      path.node.specifiers.forEach((spec) => {
                        console.log(spec.local.name)
                        excludedComponents.add(spec.local.name);
                      });
                    }
                  });
                },

                JSXElement(path) {
                  const { node } = path;
                  let tagName = "";

                  if (node.openingElement.name.type === "JSXIdentifier") {
                    tagName = node.openingElement.name.name;
                  } else if (node.openingElement.name.type === "JSXMemberExpression") {
                    tagName = node.openingElement.name.property.name;
                  }

                  if (excludedComponents.has(tagName)) return;

                  const { openingElement } = node;
                  const startLine = openingElement.loc?.start.line;
                  const endLine = node.closingElement?.loc?.end.line ?? openingElement.loc?.end.line;

                  const pushAttr = (name, value) => {
                    if (
                      !openingElement.attributes.some(
                        (attr) => attr.type === "JSXAttribute" && attr.name.name === name
                      )
                    ) {
                      openingElement.attributes.push(
                        t.jsxAttribute(t.jsxIdentifier(name), t.stringLiteral(value))
                      );
                    }
                  };

                  pushAttr("data-ai-start-line", String(startLine ?? ""));
                  pushAttr("data-ai-end-line", String(endLine ?? ""));
                  pushAttr("data-ai-comp-name", tagName);
                  pushAttr("data-ai-file-path", relPath);
                },
              });

              const output = generate(ast, {
                sourceMaps: false,
                filename: assetName,
              }, rawSource);

              compilation.updateAsset(assetName, new compiler.webpack.sources.RawSource(output.code));
            } catch (e) {
              compilation.errors.push(
                new Error(`AiTagInjectorPlugin failed on ${assetName}: ${e.message}`)
              );
            }
          }
        }
      );
    });
  }
}

module.exports = AiTagInjectorPlugin;
