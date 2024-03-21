import { Activity } from "./activity";

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

export type TranslationInput = {
  framework: string;
  css: string;
  code: string;
}

export interface ProcessedActivity {
  activity: Activity;
  pathInfo: PathInfo;
}

