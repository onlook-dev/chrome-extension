import { GithubService } from "$lib/github";
import { TranslationService } from "$lib/translation";
import { GithubSettings, Project } from "$shared/models";
import { getProcessedActivities } from "./helpers";
import { getStyleTranslationInput, getTextTranslationInput } from "./inputs";
import { trackMixpanelEvent } from "$lib/mixpanel/client";
import { StyleFramework } from "$shared/models";

import type { User, FileContentData, ProcessedActivity } from "$shared/models";

import EventEmitter from 'events';
import DiffMatchPatch from 'diff-match-patch';

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
  beforeMap = new Map<string, FileContentData>();
  filesMap = new Map<string, FileContentData>();
  private githubService: GithubService;
  private githubSettings: GithubSettings;
  private translationService: TranslationService;
  private processedActivities: ProcessedActivity[];
  private forceTailwind = false;
  private diffMatchPatch = new DiffMatchPatch();
  private processedCount = 0;
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

  toggleForceTailwind(forceTailwind: boolean) {
    this.forceTailwind = forceTailwind;
  }

  async publish(title: string, description: string): Promise<string> {
    await this.translate();
    return await this.createPullRequest(title, description);
  }

  async translate(): Promise<void> {
    try {
      this.processedCount = 0;
      this.emitEvent({
        type: ProjectPublisherEventType.TRANSLATING,
        progress: {
          processed: 0,
          total: this.processedActivities.length
        }
      })

      const activitiesByFile = new Map<string, ProcessedActivity[]>();

      // Group all processed activities together
      for (const processed of this.processedActivities) {
        let processedActivities = activitiesByFile.get(processed.pathInfo.path);
        if (!processedActivities) {
          processedActivities = [];
        }
        // Push ranked by start line
        processedActivities.push(processed);
        activitiesByFile.set(processed.pathInfo.path, processedActivities);
      }

      for (const [path, activities] of activitiesByFile.entries()) {
        const fileContent = await this.getFileFromActivity(activities[0]);

        if (!this.beforeMap.get(path)) {
          this.beforeMap.set(path, { ...fileContent });
        }

        const newFileContent = await this.updateFileWithActivities(activities, fileContent);
        this.filesMap.set(path, newFileContent);
      }
    } catch (e) {
      throw `Publish failed while processing activities. ${e}`;
    }
  }

  async createPullRequest(title: string, description: string): Promise<string> {
    try {
      this.emitEvent({
        type: ProjectPublisherEventType.PUBLISHING,
      });
      trackMixpanelEvent('Publish Project to GitHub', {
        changes: this.processedActivities.length
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

  async updateFileWithActivities(processedActivities: ProcessedActivity[], fileContent: FileContentData) {
    /*
      1. Get translation input
      2. For each change types (style, text, component)
        a. Get translation output from translation
        b. Write output back to content
      3. Return content
    */

    let patches: (new () => DiffMatchPatch.patch_obj)[] = [];

    for (const processed of processedActivities) {
      // Process style changes
      if (processed.activity.styleChanges) {
        const stylePatches = await this.processStyleChanges(processed, fileContent.content);
        patches = patches.concat(stylePatches);
      }

      // Process text changes
      if (processed.activity.textChanges) {
        const textPatches = await this.processTextChanges(processed, fileContent.content);
        patches = patches.concat(textPatches);
      }

      this.emitEvent({
        type: ProjectPublisherEventType.TRANSLATING,
        progress: {
          processed: ++this.processedCount,
          total: this.processedActivities.length
        }
      })
    }

    const result = this.diffMatchPatch.patch_apply(patches, fileContent.content);
    return {
      ...fileContent,
      content: result[0]
    }
  }

  async processStyleChanges(processed: ProcessedActivity, content: string) {
    const input = getStyleTranslationInput(content, processed.pathInfo, processed.activity);
    const newCode = await this.translationService.getStyleTranslation({
      code: input.code,
      css: input.css,
      framework: input.framework,
      tailwind: input.tailwind,
    }, this.forceTailwind ? StyleFramework.TailwindCSS : this.project.projectSettings?.styleFramework);
    return this.diffMatchPatch.patch_make(content, content.replace(input.code.trim(), newCode));
  }

  async processTextChanges(processed: ProcessedActivity, content: string) {
    const input = getTextTranslationInput(content, processed.pathInfo, processed.activity);
    const newCode = await this.translationService.getTextTranslation({
      oldText: input.oldText,
      newText: input.newText,
      code: input.code,
      framework: input.framework,
    });
    return this.diffMatchPatch.patch_make(content, content.replace(input.code.trim(), newCode));
  }

  async getFileFromActivity(processed: ProcessedActivity): Promise<FileContentData> {
    /*
      1. Process activity to get pathInfo
      2. If file already in cache, return it
      3. If not, get it from GitHub
    */

    let fileContent = this.filesMap.get(processed.pathInfo.path);
    if (fileContent) return fileContent;

    fileContent = await this.githubService.fetchFileFromPath(processed.pathInfo.path, processed.activity.snapshot);
    if (!fileContent) throw new Error(`File content not found for path: ${processed.pathInfo.path}`);

    this.filesMap.set(processed.pathInfo.path, fileContent);
    return fileContent;
  }
}