// @ts-ignore - Bun test exists
import { expect, test, describe, mock, beforeAll, beforeEach } from 'bun:test';
import type { ProjectPublisher } from '$lib/publish';

describe('ProjectPublisher', () => {
  let ProjectPublisher: any;

  beforeEach(() => {
    // File content is mutated in tests, so reset it before each test
    // TODO: This might be a sign that the file content should be cloned in the ProjectPublisher
    mockFileContent = { ...originalMockFileContent }
  })

  beforeAll(async () => {
    mock.module("$lib/utils/env", () => ({
      openAiConfig: {
        apiKey: process.env.PUBLIC_TEST_OPENAI_API_KEY,
      },
      githubConfig: {},
      firebaseConfig: {},
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

    mock.module("$lib/mixpanel/client", () => ({
      trackMixpanelEvent: () => { }
    }));

    mock.module("$shared/models", () => ({
      StyleFramework: {}
    }));

    const Publisher = await import('$lib/publish');
    ProjectPublisher = Publisher.ProjectPublisher;
  });

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
    pathInfo: { path: 'mockPath', startLine: 1, startTagEndLine: 3, endLine: 5 },
  } as any

  const originalMockFileContent = {
    path: 'mockPath',
    sha: 'mockSha',
    content: `<p 
  class='bg-red'
>
    Old Text
</p>`,
  }
  let mockFileContent = originalMockFileContent

  test('should throw error if installationId is missing', () => {
    let project = { ...mockProject, installationId: undefined };
    expect(() => new ProjectPublisher(project, mockUser)).toThrow();

    project = { ...project, installationId: {} };
    expect(() => new ProjectPublisher(project, mockUser)).not.toThrow();
  });

  test('should get correct change if nothing updated', async () => {
    const publisher: ProjectPublisher = new ProjectPublisher(mockProject, mockUser);
    const fileContent = await publisher.updateFileWithActivity(mockProcessedActivity, mockFileContent);
    expect(fileContent).toEqual(mockFileContent)
  });

  test('should get correct text input if line added from style change', async () => {
    const updatedCode = `<p 
    id='newId'
    class='bg-red'
>`
    const expectedTextInput = `<p 
    id='newId'
    class='bg-red'
>
    Old Text
</p>`
    mock.module("$lib/translation", () => ({
      TranslationService: class {
        async getStyleTranslation(content: any) { return updatedCode }
        async getTextTranslation(content: any) { return content.code }
      }
    }));
    const publisher: ProjectPublisher = new ProjectPublisher(mockProject, mockUser);
    const fileContent = await publisher.updateFileWithActivity(mockProcessedActivity, mockFileContent);
    expect(fileContent.content).toEqual(expectedTextInput)
  });

  test('should get correct text input if line removed from style change', async () => {
    const updatedCode = `<p>`
    const expectedTextInput = `<p>
    Old Text
</p>`

    mock.module("$lib/translation", () => ({
      TranslationService: class {
        async getStyleTranslation(content: any) { return updatedCode }
        async getTextTranslation(content: any) { return content.code }
      }
    }));
    const publisher: ProjectPublisher = new ProjectPublisher(mockProject, mockUser);
    const fileContent = await publisher.updateFileWithActivity(mockProcessedActivity, mockFileContent);
    expect(fileContent.content).toEqual(expectedTextInput)
  });
});