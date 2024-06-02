const t = require('@babel/types');
const { getCurrentCommit, compress } = require("../shared/helpers.js");
const { DATA_ONLOOK_ID } = require("../shared/constants.js");
const pathLib = require('path');

module.exports = function babelPluginOnlook({ root = process.cwd(), absolute = false }) {
  const commit = getCurrentCommit()
  return {
    visitor: {
      JSXElement(path, state) {
        const filename = state.file.opts.filename;
        const nodeModulesPath = `${root}/node_modules`;

        // Ignore node_modules
        if (filename.startsWith(nodeModulesPath)) {
          return;
        }

        // Ensure `loc` exists before accessing its properties
        if (!path.node.openingElement.loc || !path.node.openingElement.loc.start || !path.node.openingElement.loc.end) {
          return;
        }

        const attributeValue = getDataOnlookId(path, filename, commit, root, absolute);

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


function getDataOnlookId(path, filename, commit, root, absolute) {
  const startTag = {
    start: {
      line: path.node.openingElement.loc.start.line,
      column: path.node.openingElement.loc.start.column + 1
    },
    end: {
      line: path.node.openingElement.loc.end.line,
      column: path.node.openingElement.loc.end.column + 1
    }
  }
  const endTag = path.node.closingElement ? {
    start: {
      line: path.node.closingElement.loc.start.line,
      column: path.node.closingElement.loc.start.column + 1
    },
    end: {
      line: path.node.closingElement.loc.end.line,
      column: path.node.closingElement.loc.end.column + 1
    }
  } : null

  const domNode = {
    path: absolute ? filename : pathLib.relative(root, filename),
    startTag,
    endTag,
    commit
  };

  return compress(domNode);
}
