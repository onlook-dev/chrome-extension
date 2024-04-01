import type { Activity } from "./activity";

export interface FileContentData {
  path: string;
  content: string;
  sha: string;
}

export interface PathInfo {
  path: string;
  startLine: number;
  startTagEndLine: number;
  endLine: number;
}

export type StyleTranslationInput = {
  framework: string;
  css: string;
  code: string;
  tailwind: string;
}

export type TextTranslationInput = {
  framework: string;
  oldText: string;
  newText: string;
  code: string;
}

export interface ProcessedActivity {
  activity: Activity;
  pathInfo: PathInfo;
}

