import path from "path";
import MagicString from "magic-string";
import fs from "fs";

import { parse, walk } from "svelte/compiler";
import { DATA_ONLOOK_ID } from "../shared/constants.js";
import { getCurrentCommit } from "../shared/helpers.js";
import { strToU8, strFromU8, compressSync, decompressSync } from 'fflate'

export const onlookPreprocess = ({ root = path.resolve('.'), absolute = false, commit_hash = getCurrentCommit() }) => {
  return {
    markup: ({ content, filename }) => {
      const nodeModulesPath = path.resolve(root, "node_modules");
      const sveltekitPath = path.resolve(root, ".svelte-kit");

      // Ignore node_modules
      if (filename.startsWith(nodeModulesPath) || filename.startsWith(sveltekitPath)) {
        return { code: content };
      }

      // TODO: This is a hack, doesn't account for script tag being at the bottom of the file
      let lineOffset = 0;
      try {
        // Calculate offset from typescript preprocessing step
        let data = fs.readFileSync(filename);
        let originalLineNum = data.toString().split("\n").length;
        let postLineNum = content.split("\n").length;
        lineOffset = originalLineNum - postLineNum;
      } catch (e) {
        lineOffset = 0;
      }

      const ast = parse(content);
      const s = new MagicString(content, { filename });

      walk(ast.html, {
        enter(node) {
          if (node.type === "Element") {
            // Calculate the line number for each element node
            const attributeValue = getDataOnlookId(node, content, lineOffset, filename, commit_hash, root, absolute);
            const attributeName = `${DATA_ONLOOK_ID}='${attributeValue}'`;
            const startTagEnd = node.start + node.name.length + 1;
            s.appendLeft(startTagEnd, ` ${attributeName}`);
          }
        },
      });
      return {
        code: s.toString(),
        map: s.generateMap({ hires: true }),
      };
    },
  };
};

function getDataOnlookId(node, content, lineOffset, filename, commit, root, absolute) {
  const { startTag, endTag } = getTagPositions(content, node, lineOffset)
  const domNode = {
    path: absolute ? filename : path.relative(root, filename),
    startTag,
    endTag,
    commit
  };
  return compress(domNode);
}

export function compress(json) {
  // Compress JSON to base64
  const buf = strToU8(JSON.stringify(json));
  const compressed = compressSync(buf);
  const base64 = Buffer.from(compressed).toString('base64');
  return base64;
}

export function decompress(base64) {
  // Decompress base64 to JSON
  const decompressed = decompressSync(Buffer.from(base64, 'base64'));
  const str = strFromU8(decompressed);
  return JSON.parse(str);
}

// For testing tags by printing start and end tag based on information
function testTags(filename, startTag, endTag) {
  const content = fs.readFileSync(filename, 'utf8');

  const startTagContent = extractTagContent(content, startTag);
  console.log("S:", "'" + startTagContent + "'");

  // Check if there is an end tag and extract its content if present
  if (endTag) {
    const endTagContent = extractTagContent(content, endTag);
    console.log("E:", "'" + endTagContent + "'");
  } else {
    console.log("E:", "null");
  }
}

// Note: line and columns are 1-index extraction is 0-index
export function extractTagContent(content, tagPosition) {
  const lines = content.split('\n');

  // Extract content for the given tag position from start line column to end line column
  if (tagPosition) {
    const { start, end } = tagPosition;
    if (!start || !end) return null;

    if (start.line === end.line) {
      // Tag content is within a single line
      return lines[start.line - 1].substring(start.column - 1, end.column - 1);
    } else {
      // Tag content spans multiple lines
      let extractedContent = [];

      // Add the part of the start line after the start column
      extractedContent.push(lines[start.line - 1].substring(start.column - 1));

      // Add all lines in between
      for (let i = start.line; i < end.line - 1; i++) {
        extractedContent.push(lines[i]);
      }

      // Add the part of the end line before the end column
      extractedContent.push(lines[end.line - 1].substring(0, end.column - 1));
      return extractedContent.join('\n');
    }
  }
  return null;
}

function getTagPositions(content, node, lineOffset) {
  let startTagEnd;
  let endTagStart = null;

  if (node.children && node.children.length > 0) {
    // Use the start of the first child as the end of the start tag
    startTagEnd = node.children[0].start;

    // Use the end of the last child to infer the start of the end tag
    endTagStart = node.children[node.children.length - 1].end;

    // Find the actual end tag text from this point onwards
    const endTagText = `</${node.name}>`;
    endTagStart = content.indexOf(endTagText, endTagStart);
    if (endTagStart === -1) {
      endTagStart = node.end;  // Fallback if the end tag isn't found (shouldn't happen)
    }
  } else {
    // If no children, assume the start tag ends just before any content 
    startTagEnd = content.indexOf('>', node.start) + 1;
    if (content[startTagEnd - 2] === '/') {
      // Adjust for self-closing tags
      startTagEnd = node.end;
    } else {
      // Assume end tag starts after any content
      endTagStart = content.lastIndexOf('<', node.end);
    }
  }

  function getLineAndColumn(pos) {
    if (!pos || !content) return null;

    const line = content.slice(0, pos).split("\n").length + lineOffset;;
    const column = pos - content.lastIndexOf("\n", pos - 1);
    return { line, column };
  }

  return {
    startTag: {
      start: getLineAndColumn(node.start),
      end: getLineAndColumn(startTagEnd)
    },
    endTag: startTagEnd === node.end ? null : {
      start: getLineAndColumn(endTagStart),
      end: getLineAndColumn(node.end)
    }
  };
}