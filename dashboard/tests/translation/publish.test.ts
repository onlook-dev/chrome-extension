// @ts-ignore - Bun test exists
import { expect, test, describe, mock, beforeAll, fn } from 'bun:test';

describe('ProjectPublisher', () => {
  let ProjectPublisher: any;

  const mockUser = { id: 'mockUserId', email: 'mockUserEmail', name: 'mockUserName' } as any;
  const mockProject = {
    id: 'mockProjectId',
    name: 'mockProjectName',

    installationId: 'mockInstallationId',
    githubSettings: {
      owner: 'mockOwner',
      repositoryName: 'mockRepositoryName',
      baseBranch: 'mockBaseBranch',
      rootPath: 'mockRootPath',
    },
    activities: {},
  } as any;

  beforeAll(async () => {
    mock.module("$lib/utils/env", () => ({
      openAiConfig: {
        apiKey: process.env.PUBLIC_TEST_OPENAI_API_KEY,
      },
      githubConfig: {}
    }))

    mock.module("$lib/translation", () => ({
      TranslationService: (() => ({
        getStyleTranslation: () => Promise.resolve('mockStyleTranslation'),
        getTextTranslation: () => Promise.resolve('mockStyleTranslation'),
      }))
    }));
    const Publisher = await import('$lib/publish');
    ProjectPublisher = Publisher.ProjectPublisher;
  });

  test('should throw error if project has no installation ID', () => {
    const project = { ...mockProject, installationId: undefined };
    expect(() => new ProjectPublisher(project, mockUser)).toThrow();
  });
});