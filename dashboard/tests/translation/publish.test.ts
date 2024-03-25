import { expect, test, describe, mock, beforeAll, mockImplementation } from 'bun:test';
import type { ProjectPublisher } from '$lib/publish';

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

  const mockActivity = {
    id: 'mockActivityId',
    styleChanges: {
      color: { key: 'color', newVal: 'red', oldVal: 'black' },
      backgroundColor: { key: 'background-color', newVal: 'blue', oldVal: 'white' }
    },
    textChanges: {
      text: { newVal: 'newText', oldVal: 'oldText' },
    },
  }

  const mockProcessedActivity = {
    activity: mockActivity,
    pathInfo: { path: 'mockPath', startLine: 1, startTagEndLine: 2, endLine: 3 },
  } as any

  const mockContent = {
    path: 'mockPath',
    sha: 'mockSha',
    content: `<div>
  <p 
    class='bg-red'
  >
    Old Text
  </p>`,
  }

  beforeAll(async () => {
    mock.module("$lib/utils/env", () => ({
      openAiConfig: {
        apiKey: process.env.PUBLIC_TEST_OPENAI_API_KEY,
      },
      githubConfig: {}
    }))

    mock.module("$lib/translation", () => ({
      TranslationService: class {
        async getStyleTranslation(input: any) { return input.code }
        async getTextTranslation(input: any) { return input.code }
      }
    }));

    mock.module("$lib/github", () => {
      const GithubService = class { };
      return { GithubService };

    });

    const Publisher = await import('$lib/publish');
    ProjectPublisher = Publisher.ProjectPublisher;
  });

  test('should throw error if installationId is missing', () => {
    let project = { ...mockProject, installationId: undefined };
    expect(() => new ProjectPublisher(project, mockUser)).toThrow();

    project = { ...project, installationId: {} };
    expect(() => new ProjectPublisher(project, mockUser)).not.toThrow();
  });

  test('should get correct style change', async () => {
    const publisher: ProjectPublisher = new ProjectPublisher(mockProject, mockUser);
    const { content } = await publisher.updateFileWithActivity(mockProcessedActivity, mockContent);
    expect(content).toBe(content)
  });
});