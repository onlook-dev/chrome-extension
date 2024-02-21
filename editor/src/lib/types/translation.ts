// Parsed object to be passed into translator
export type Changes = { 
  path: string;
  selector: string;
  newValues: string[];
  startLine: string;
  endLine: string;
  currentValue: string; 
}

// Object returned from translator to be created into PR
export type Translation = { 
  path: string;
  startLine: string;
  endLine: string;
  oldValue: string;
  newValue: string; 
}