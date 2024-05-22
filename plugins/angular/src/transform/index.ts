import * as fs from 'fs';
import * as path from 'path';
import * as parse5 from 'parse5-case-sensitive';
import { Element } from 'parse5-case-sensitive/dist/tree-adapters/default';

// Preprocess function to modify HTML files
export function preprocess(fileMap: Map<string, string>) {
  const srcDir = '.';
  const cacheDir = '.onlook_cache';

  // Ensure cache directory exists
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  // Helper function to process each HTML file
  function processHtmlFile(filePath: string) {
    const isComponent = filePath.includes('.component.html');
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    const relativeFilePath = path.relative(srcDir, filePath);
    const cacheFilePath = path.join(cacheDir, relativeFilePath);

    // Save a copy of the original file in the cache directory
    fs.mkdirSync(path.dirname(cacheFilePath), { recursive: true });
    fs.writeFileSync(cacheFilePath, originalContent);
    fileMap.set(filePath, cacheFilePath);

    // Escape template syntax
    let escapedContent = originalContent
      // .replace(/@for\s*\((.*?)\)\s*\{/g, '<!--@for($1){-->')
      // .replace(/\{\s*$/gm, '<!--{-->')
      // .replace(/\}\s*$/gm, '<!--}-->');

    // Parse the HTML content
    // If any.component.html, parseFragment. If just any.html then parse
    let ast;
    if (isComponent) {
      ast = parse5.parseFragment(escapedContent, { sourceCodeLocationInfo: true, });
    } else {
      ast = parse5.parse(escapedContent, { sourceCodeLocationInfo: true, });
    }

    // Traverse and modify the DOM tree
    function traverseAndModify(node: any, filePath: string) {
      if (
        'tagName' in node 
        && node.tagName 
        && node.sourceCodeLocation 
      ) {
        const startTagStart = node.sourceCodeLocation.startTag.startLine;
        const startTagEnd = node.sourceCodeLocation.startTag.endLine;
        const endTagEnd = (node.sourceCodeLocation.endTag ? node.sourceCodeLocation.endTag.endLine : startTagEnd);

        (node as Element).attrs.push({
          name: 'data-onlook-id',
          value: `${filePath}:${startTagStart}:${startTagEnd}:${endTagEnd}`
        });
      }

      if ('childNodes' in node) {
        for (const childNode of node.childNodes) {
          traverseAndModify(childNode, filePath);
        }
      }
    }

    traverseAndModify(ast, relativeFilePath);

    // Serialize the modified DOM tree back to HTML
    let modifiedContent = parse5.serialize(ast);

    modifiedContent = modifiedContent.replace(/&amp;/g, '&');
    // modifiedContent = modifiedContent
      // .replace(/<!--@for\((.*?)\){-->/g, '@for($1){')
      // .replace(/<!--{-->/g, '{')
      // .replace(/<!--}-->/g, '}');
      
    // Write the modified content back to the original file
    try {
      fs.writeFileSync(filePath, modifiedContent, 'utf-8');
    } catch (error) {
      console.error(`Failed to write file: ${filePath}`, error);
    }
  }

  // Recursively process all HTML files in the src directory
  function traverseDirectory(directory: string) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        traverseDirectory(filePath);
      } else if (file.endsWith('.html')) {
        processHtmlFile(filePath);
      }
    }
  }

  traverseDirectory(srcDir);
}

// Postprocess function to restore original HTML files
export function postprocess(fileMap: Map<string, string>) {
  const cacheDir = '.onlook_cache';
  if (!fs.existsSync(cacheDir)) {
    return;
  }
  for (const [originalPath, cachePath] of fileMap.entries()) {
    const originalContent = fs.readFileSync(cachePath, 'utf-8');
    try {
      fs.writeFileSync(originalPath, originalContent, 'utf-8');
    } catch (error) {
      console.error(`Failed to restore file: ${originalPath}`, error);
    }
  }

  // Delete the cache directory
  try {
    fs.rmSync(cacheDir, { recursive: true });
  } catch (error) {
    console.error(`Failed to delete cache directory: ${cacheDir}`, error);
  }
  fileMap.clear();
}
