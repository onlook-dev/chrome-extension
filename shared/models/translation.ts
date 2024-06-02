import type { Activity, TemplateNode } from ".";

export interface FileContentData {
  path: string;
  content: string;
  sha: string;
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
  node: TemplateNode;
}

