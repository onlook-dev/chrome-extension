export interface CodeChange {
  id: string;
  projectId: string;

  // Metadata
  status: CodeChangeStatus;
  createdAt: string;
  updatedAt: string;

  // Content
  path: string;
  startLine: number;
  startTagEndLine: number;
  endLine: number;
  oldContent: string;
  newContent?: string;
}

enum CodeChangeStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}