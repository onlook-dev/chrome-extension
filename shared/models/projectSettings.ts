
export interface ProjectSettings {
  styleFramework?: StyleFramework;
}

export enum StyleFramework {
  TailwindCSS = 'TailwindCSS',
  InlineCSS = 'InlineCSS',
}