import pathLib from "path";
import { execSync } from 'child_process';

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