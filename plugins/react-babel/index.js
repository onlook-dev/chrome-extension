const t = require('@babel/types');
const { generateDataAttributeValue, getCurrentCommit } = require("../shared/helpers.js");
const { DATA_ONLOOK_ID } = require("../shared/constants.js");

module.exports = function babelPluginOnlook({ root = process.cwd(), absolute = false }) {
  const gitCommit = getCurrentCommit()
  let snapshotAdded = false
  function addDivToBody(path) {
    if (snapshotAdded) return
    if (path.node.openingElement.name.name === 'body' || path.node.openingElement.name.name === 'div') {
      // Create the new div element
      const newDiv = t.jSXElement(
        t.jSXOpeningElement(t.jSXIdentifier("div"), [
          t.jSXAttribute(t.jSXIdentifier("id"), t.stringLiteral("onlook-meta")),
          t.jSXAttribute(t.jSXIdentifier("data-onlook-snapshot"), t.stringLiteral(gitCommit)),
        ]),
        t.jSXClosingElement(t.jSXIdentifier("div")),
        [],
        false
      );

      // Append the new div element as a child
      path.node.children.push(newDiv);
      snapshotAdded = true
    }
  }

  return {
    visitor: {
      JSXElement(path, state) {
        const filename = state.file.opts.filename;
        const nodeModulesPath = `${root}/node_modules`;

        // Ignore node_modules
        if (filename.startsWith(nodeModulesPath)) {
          return;
        }

        addDivToBody(path);

        // Ensure `loc` exists before accessing its properties
        if (!path.node.openingElement.loc || !path.node.openingElement.loc.start || !path.node.openingElement.loc.end) {
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
      }
    },
  };
};
