import pathLib from "path";
import { execSync } from 'child_process';
import { strToU8, strFromU8, compressSync, decompressSync } from 'fflate'

export function generateDataAttributeValue(filePath, lineStart, lineEnd, lineClosing, root, absolute = false) {
  // Convert the absolute path to a path relative to the project root
  const relativeFilePath = absolute ? filePath : pathLib.relative(root || process.cwd(), filePath);
  return `${relativeFilePath}:${lineStart}:${lineEnd}:${lineClosing}`;
}

export function getCurrentCommit() {
  try {
    const stdout = execSync('git rev-parse HEAD');
    return stdout.toString().trim();
  } catch (err) {
    // Not a git repository or some other error occurred
    return null;
  }
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

// For testing tags by printing start and end tag based on information
export function testTags(filename, startTag, endTag) {
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

export function getTemplateContent(content, templateNode) {
  const { startTag, endTag } = templateNode;
  const startTagContent = extractTagContent(content, startTag);
  let childrenContent = null;
  let endTagContent = null;

  if (endTag) {
    endTagContent = extractTagContent(content, endTag);
    childrenPos = {
      start: startTag.end,
      end: endTag.start
    }
    childrenContent = extractTagContent(content, childrenPos);
  }
  return {
    startTagContent,
    childrenContent,
    endTagContent
  }
}