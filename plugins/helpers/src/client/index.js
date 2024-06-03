import { strToU8, strFromU8, compressSync, decompressSync } from 'fflate'
import fs from "fs";

export function compress(json) {
    // Compress JSON to base64
    const buf = strToU8(JSON.stringify(json));
    const compressed = compressSync(buf);
    let base64;
    // Check if running in a browser
    if (typeof window !== 'undefined' && window.btoa) {
        // Use browser's method to convert binary data to a string and then encode to base64
        const binaryString = Array.from(new Uint8Array(compressed)).map(byte => String.fromCharCode(byte)).join('');
        base64 = btoa(binaryString);
    } else {
        base64 = Buffer.from(compressed).toString('base64');
    }
    return base64;
}

export function decompress(base64) {
    // Decompress base64 to JSON
    let buffer;
    if (typeof window !== 'undefined' && window.atob) {
        buffer = new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
    } else {
        buffer = Buffer.from(base64, 'base64');
    }
    const decompressed = decompressSync(buffer);
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
        const childrenPos = {
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