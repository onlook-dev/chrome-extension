import { GithubService } from "$lib/github";
import { TranslationService } from "$lib/translation";
import { GithubSettings } from "$shared/models/github";
import { Project } from "$shared/models/project";
import { FileContentData, PathInfo, ProcessedActivity } from "$shared/models/translation";
import { User } from "$shared/models/user";
import { getProcessedActivities, updateContentChunk } from "./helpers";
import EventEmitter from 'events';
import { getStyleTranslationInput, getTextTranslationInput } from "./inputs";

export enum ProjectPublisherEventType {
  TRANSLATING = 'TRANSLATING',
  PUBLISHING = 'PUBLISHING',
}

export interface ProjectPublisherEvent {
  type: ProjectPublisherEventType;
  progress?: {
    processed: number;
    total: number;
  }
}

export class ProjectPublisher extends EventEmitter {
  private githubService: GithubService;
  private githubSettings: GithubSettings;
  private translationService: TranslationService;
  private filesMap = new Map<string, FileContentData>();
  private processedActivities: ProcessedActivity[];

  EMIT_EVENT_NAME = 'update';

  constructor(private project: Project, private user: User) {
    super();
    if (!this.project.installationId) {
      throw 'Publish failed: Project has no installation ID';
    }

    if (!this.project.githubSettings) {
      throw 'Publish failed: No github settings found for this project';
    }

    this.processedActivities = getProcessedActivities(this.project.activities, this.project.githubSettings.rootPath);
    this.githubSettings = this.project.githubSettings;
    this.githubService = new GithubService(
      this.project.installationId,
      this.githubSettings.owner,
      this.githubSettings.repositoryName,
      this.githubSettings.baseBranch
    );
    this.translationService = new TranslationService();
  }

  private emitEvent(event: ProjectPublisherEvent) {
    this.emit(this.EMIT_EVENT_NAME, event);
  }

  async publish(title: string, description: string): Promise<string> {
    /*
      Emit state for each step
      1. For each activity:
        1. Get file from map
        2. Create translation
        3. Write file to map
      2. Publish all files
    */

    try {
      this.emitEvent({
        type: ProjectPublisherEventType.TRANSLATING,
        progress: {
          processed: 0,
          total: this.processedActivities.length
        }
      })

      for (const [index, processed] of this.processedActivities.entries()) {
        const fileContent = await this.getFileFromActivity(processed);
        const newFileContent = await this.updateFileWithActivity(processed, fileContent);
        this.filesMap.set(processed.pathInfo.path, newFileContent);

        this.emitEvent({
          type: ProjectPublisherEventType.TRANSLATING,
          progress: {
            processed: index + 1,
            total: this.processedActivities.length
          }
        })
      }
    } catch (e) {
      throw `Publish failed while processing activities. ${e}`;
    }

    try {
      this.emitEvent({
        type: ProjectPublisherEventType.PUBLISHING,
      });
      return await this.publishFiles(title, description);
    } catch (e) {
      throw `Publish failed while publishing files. ${e}`;
    }
  }

  private async publishFiles(
    title: string,
    description: string
  ): Promise<string> {
    /*
     1. Create or get branch
     2. Add commit to branch
     3. Create or get pull request
     4. Return pull request url
   */
    const projectBranch = `onlook-${this.project.id}`;
    await this.githubService.createOrGetBranch(projectBranch);
    await this.githubService.createCommitFromFiles(
      projectBranch,
      this.user.name,
      this.user.email,
      title,
      Array.from(this.filesMap.values())
    );
    return await this.githubService.createOrGetPullRequest(
      title,
      description,
      projectBranch
    );
  }

  async updateFileWithActivity(processed: ProcessedActivity, fileContent: FileContentData) {
    /*
      1. Get translation input
      2. Get translation output from translation
      3. Write output back to content
      4. Return content
    */

    let offset = 0;
    let newContent = fileContent.content;
    // Process style changes first
    if (processed.activity.styleChanges) {
      const { newContent: styleContent, newOffset } = await this.processStyleChanges(processed, newContent, offset);
      newContent = styleContent;
      offset += newOffset;
    }

    // TODO: Add tests for interacting changes with offset
    if (processed.activity.textChanges) {
      const { newContent: textContent, newOffset } = await this.processTextChanges(processed, newContent, offset);
      newContent = textContent;
      offset += newOffset;
    }
    fileContent.content = newContent;
    return fileContent;
  }

  async processStyleChanges(processed: ProcessedActivity, content: string, offset: number = 0) {
    const newPathInfo = {
      ...processed.pathInfo,
      startTagEndLine: processed.pathInfo.startTagEndLine + offset,
      endLine: processed.pathInfo.endLine + offset,
    } as PathInfo;

    const input = getStyleTranslationInput(content, newPathInfo, processed.activity);
    const newCode = await this.translationService.getStyleTranslation({
      code: input.code,
      css: input.css,
      framework: input.framework,
    });

    const newContent = updateContentChunk(
      content,
      newCode,
      newPathInfo,
      false
    );
    const newOffset = offset + newCode.split('\n').length - input.code.split('\n').length;
    return { newContent, newOffset };
  }

  async processTextChanges(processed: ProcessedActivity, content: string, offset: number = 0) {
    const newPathInfo = {
      ...processed.pathInfo,
      startTagEndLine: processed.pathInfo.startTagEndLine + offset,
      endLine: processed.pathInfo.endLine + offset,
    } as PathInfo;

    const input = getTextTranslationInput(content, newPathInfo, processed.activity);
    const newCode = await this.translationService.getTextTranslation({
      oldText: input.oldText,
      newText: input.newText,
      code: input.code,
      framework: input.framework,
    });

    const newContent = updateContentChunk(
      content,
      newCode,
      newPathInfo,
      true
    );
    const newOffset = offset + newCode.split('\n').length - input.code.split('\n').length;
    return { newContent, newOffset };
  }

  async getFileFromActivity(processed: ProcessedActivity): Promise<FileContentData> {
    /*
      1. Process activity to get pathInfo
      2. If file already in cache, return it
      3. If not, get it from GitHub
    */

    let fileContent = this.filesMap.get(processed.pathInfo.path);
    if (fileContent) return fileContent;

    fileContent = await this.githubService.fetchFileFromPath(processed.pathInfo.path);
    if (!fileContent) throw new Error(`File content not found for path: ${processed.pathInfo.path}`);

    this.filesMap.set(processed.pathInfo.path, fileContent);
    return fileContent;
  }
}