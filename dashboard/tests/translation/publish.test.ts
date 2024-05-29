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
    const fileContent = await publisher.updateFileWithActivities([mockProcessedActivity], mockFileContent);
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
    const fileContent = await publisher.updateFileWithActivities([mockProcessedActivity], mockFileContent);
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
    const fileContent = await publisher.updateFileWithActivities([mockProcessedActivity], mockFileContent);
    expect(fileContent.content).toEqual(expectedTextInput)
  });

  test('should handle multiple changes in the same file', async () => {
    const updatedStyleCode = `<p>`
    const expectedFileContent = `<p>
    newText
</p>`

    mock.module("$lib/translation", () => ({
      TranslationService: class {
        async getStyleTranslation(content: any) { return updatedStyleCode }
        async getTextTranslation(content: any) {
          return `<p 
    class='bg-red'
>
    newText
</p>` }
      }
    }));

    const publisher: ProjectPublisher = new ProjectPublisher(mockProject, mockUser);
    const fileContent = await publisher.updateFileWithActivities([mockProcessedActivity], mockFileContent);
    expect(fileContent.content).toEqual(expectedFileContent);
  });

  test('should handle multiple activities consecutively on the same file with multiple DOM elements', async () => {
    const originalFileContent = {
      path: 'mockPath',
      sha: 'mockSha',
      content: `<div 
    class='bg-red'
>
    Old Div Text
</div>
<span 
    class='text-red'
>
    Old Span Text
</span>`,
    }

    const mockActivity1 = {
      id: 'mockActivityId1',
      styleChanges: {
        color: { key: 'color', newVal: 'yellow', oldVal: 'red' },
      },
      textChanges: {
        text: { newVal: 'Updated Div Text', oldVal: 'Old Div Text' },
      },
    }

    const mockProcessedActivity1 = {
      activity: mockActivity1,
      pathInfo: { path: 'mockPath', startLine: 1, startTagEndLine: 3, endLine: 5 },
    } as any

    const mockActivity2 = {
      id: 'mockActivityId2',
      styleChanges: {
        color: { key: 'color', newVal: 'green', oldVal: 'red' },
      },
      textChanges: {
        text: { newVal: 'Updated Span Text', oldVal: 'Old Span Text' },
      },
    }

    const mockProcessedActivity2 = {
      activity: mockActivity2,
      pathInfo: { path: 'mockPath', startLine: 6, startTagEndLine: 8, endLine: 10 },
    } as any


    const updatedStyleCode1 = `<div class='bg-yellow'>`
    const updatedTextCode1 = `<div 
    class='bg-red'
>
    Updated Div Text
</div>`
    const updatedStyleCode2 = `<span 
    class='text-green'
>`
    const updatedTextCode2 = `<span 
    class='text-red'
>
    Updated Span Text
</span>`
    const expectedFileContent = `<div class='bg-yellow'>
    Updated Div Text
</div>
<span 
    class='text-green'
>
    Updated Span Text
</span>`

    mock.module("$lib/translation", () => ({
      TranslationService: class {
        async getStyleTranslation(content: any) {
          if (content.code === "<div \n    class='bg-red'\n>") return updatedStyleCode1;
          return updatedStyleCode2;
        }
        async getTextTranslation(content: any) {
          if (content.oldText === "Old Div Text") return updatedTextCode1;
          return updatedTextCode2;
        }
      }
    }));

    const publisher: ProjectPublisher = new ProjectPublisher(mockProject, mockUser);

    let fileContent = await publisher.updateFileWithActivities([mockProcessedActivity1, mockProcessedActivity2], originalFileContent);
    expect(fileContent.content).toEqual(expectedFileContent);
  });

  test('should handle multiple activities with other DOM elements', async () => {
    const originalFileContent = {
      path: 'mockPath',
      sha: 'mockSha',
      content: `<input/>
<div 
    class='bg-red'
>
    Old Div Text
</div>
<span 
    class='text-red'
>
    Old Span Text
</span>`,
    }

    const mockActivity1 = {
      id: 'mockActivityId1',
      styleChanges: {
        color: { key: 'color', newVal: 'yellow', oldVal: 'red' },
      },
      textChanges: {
        text: { newVal: 'Updated Div Text', oldVal: 'Old Div Text' },
      },
    }

    const mockProcessedActivity1 = {
      activity: mockActivity1,
      pathInfo: { path: 'mockPath', startLine: 2, startTagEndLine: 4, endLine: 6 },
    } as any

    const mockActivity2 = {
      id: 'mockActivityId2',
      styleChanges: {
        color: { key: 'color', newVal: 'green', oldVal: 'red' },
      },
      textChanges: {
        text: { newVal: 'Updated Span Text', oldVal: 'Old Span Text' },
      },
    }

    const mockProcessedActivity2 = {
      activity: mockActivity2,
      pathInfo: { path: 'mockPath', startLine: 7, startTagEndLine: 9, endLine: 11 },
    } as any

    const updatedStyleCode1 = `<div class='bg-yellow'>`
    const updatedTextCode1 = `<div 
    class='bg-red'
>
    Updated Div Text
</div>`
    const updatedStyleCode2 = `<span 
    class='text-green'
>`
    const updatedTextCode2 = `<span 
    class='text-red'
>
    Updated Span Text
</span>`

    const expectedFileContent = `<input/>
<div class='bg-yellow'>
    Updated Div Text
</div>
<span 
    class='text-green'
>
    Updated Span Text
</span>`

    mock.module("$lib/translation", () => ({
      TranslationService: class {
        async getStyleTranslation(content: any) {
          if (content.code === "<div \n    class='bg-red'\n>") return updatedStyleCode1;
          return updatedStyleCode2;
        }
        async getTextTranslation(content: any) {
          if (content.oldText === "Old Div Text") return updatedTextCode1;
          return updatedTextCode2;
        }
      }
    }));

    const publisher: ProjectPublisher = new ProjectPublisher(mockProject, mockUser);
    let fileContent = await publisher.updateFileWithActivities([mockProcessedActivity1, mockProcessedActivity2], originalFileContent);
    expect(fileContent.content).toEqual(expectedFileContent);
  });
});