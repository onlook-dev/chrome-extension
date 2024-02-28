// Parsed object to be passed into translator
export type TranslationInput = {
  path: string;
  currentClasses: string;
  newCss: string[];
}

// Object returned from translator to be created into PR
export type TranslationOutput = {
  path: string;
  currentClasses: string;
  newClasses: string[];
}