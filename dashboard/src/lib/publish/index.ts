import { GithubService } from "$lib/github";
import { TranslationService } from "$lib/translation";
import { GithubSettings } from "$shared/models/github";
import { Project } from "$shared/models/project";
import { FileContentData, ProcessedActivity } from "$shared/models/translation";
import { User } from "$shared/models/user";
import { getProcessedActivities, getTranslationInput, updateContentChunk } from "./helpers";

export class ProjectPublisher {
  private githubService: GithubService;
  private githubSettings: GithubSettings;
  private translationService: TranslationService;
  private filesMap = new Map<string, FileContentData>();
  private processedActivities: ProcessedActivity[];

  constructor(private project: Project, private user: User, private rootPath: string) {
    if (!this.project.installationId) {
      console.error('Project has no installation ID');
      throw 'Export failed: Project has no installation ID';
    }

    if (!this.project.githubSettings) {
      console.error('No github settings found for this project');
      throw 'Export failed: No github settings found for this project';
    }

    this.processedActivities = getProcessedActivities(this.project.activities, this.rootPath);
    this.githubSettings = this.project.githubSettings;
    this.githubService = new GithubService(this.project.installationId);
    this.translationService = new TranslationService();
  }

  async publish() {
    /*
      Emit state for each step
      1. For each activity:
        1. Get file from map
        2. Create translation
        3. Write file to map
      2. Publish all files
    */

    for (const processed of this.processedActivities) {
      const fileContent = await this.getFileFromActivity(processed);
      const newFileContent = await this.updateFileWithActivity(processed, fileContent);
      // TODO: this.emitState();
      this.filesMap.set(processed.pathInfo.path, newFileContent);
    }
  }

  async updateFileWithActivity(processed: ProcessedActivity, fileContent: FileContentData) {
    /*
      1. Get translation input
      2. Get translation output from translation
      3. Write output back to content
      4. Return content
    */
    const input = getTranslationInput(fileContent.content, processed.pathInfo, processed.activity);

    const newCode = await this.translationService.getTranslation({
      code: input.code,
      css: input.css,
      framework: input.framework,
    });

    const newContent = updateContentChunk(
      fileContent.content,
      newCode,
      processed.pathInfo
    );

    fileContent.content = newContent;
    return fileContent;
  }

  // TODO: This log should be more testable
  async getFileFromActivity(processed: ProcessedActivity): Promise<FileContentData> {
    /*
      1. Process activity to get pathInfo
      2. If file already in cache, return it
      3. If not, get it from GitHub
    */

    let fileContent = this.filesMap.get(processed.pathInfo.path);
    // If item in cache, return it
    if (fileContent) return fileContent;

    fileContent = await this.githubService.fetchFileFromPath(
      this.githubSettings.owner,
      this.githubSettings.repositoryName,
      this.githubSettings.baseBranch,
      processed.pathInfo.path
    );

    if (!fileContent) throw new Error(`File content not found for path: ${processed.pathInfo.path}`);
    this.filesMap.set(processed.pathInfo.path, fileContent);
    return fileContent;
  }
}