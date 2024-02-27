// Parsed object to be passed into translator
export type TranslationInput = {
  // Identifier
  selector: string;
  path: string;
  startLine: string;
  endLine: string;

  currentValue: string;
  newValues: string[];
}

// Object returned from translator to be created into PR
export type Translation = {
  // Identifier
  selector: string;
  path: string;
  startLine: string;
  endLine: string;

  oldValue: string;
  newValue: string;
}