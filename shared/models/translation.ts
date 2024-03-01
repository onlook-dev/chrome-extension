export interface FileContentData {
  path: string;
  content: string;
  sha: string;
}

export interface PathInfo {
  path: string;
  startLine: number;
  endLine: number;
}

export type TranslationInput = {
  pathInfo: PathInfo;
  newCss: string;
  codeChunk: string;
}

// Object returned from translator to be created into PR
export type TranslationOutput = {
  pathInfo: PathInfo;
  codeChunk: string;
}