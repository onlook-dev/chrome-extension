import type { PathInfo } from "$lib/github/files";

// Parsed object to be passed into translator
export type TranslationInput = {
  pathInfo: PathInfo;
  classes: string;
  newCss: string;
}

// Object returned from translator to be created into PR
export type TranslationOutput = {
  pathInfo: PathInfo;
  classes: string;
}