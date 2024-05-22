const { default: generate } = require('@babel/generator');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const { generateDataAttributeValue } = require("../shared/helpers.js");
const { DATA_ONLOOK_ID } = require("../shared/constants.js");

module.exports = function babelPluginOnlook({ root = process.cwd(), absolute = false }) {
  return {
    visitor: {
      JSXElement(path, state) {
        const filename = state.file.opts.filename;
        const nodeModulesPath = `${root}/node_modules`;

        // Ignore node_modules
        if (filename.startsWith(nodeModulesPath)) {
          return;
        }

        // Get the line number for the closing tag, or the opening tag if self-closing
        const closingTagLine = path.node.closingElement
          ? path.node.closingElement?.loc.end.line
          : path.node.openingElement.loc.end.line;

        const attributeValue = generateDataAttributeValue(
          filename,
          path.node.openingElement.loc.start.line,
          path.node.openingElement.loc.end.line,
          closingTagLine,
          root,
          absolute
        );

        // Create the custom attribute
        const onlookAttribute = t.jSXAttribute(
          t.jSXIdentifier(DATA_ONLOOK_ID),
          t.stringLiteral(attributeValue)
        );

        // Append the attribute to the element
        path.node.openingElement.attributes.push(onlookAttribute);
      },
    },
  };
};