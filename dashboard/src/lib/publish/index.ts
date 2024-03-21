import { GithubService } from "$lib/github";
import { getPathInfo } from "$lib/translation/helpers";
import { Activity } from "$shared/models/activity";
import { GithubSettings } from "$shared/models/github";
import { Project } from "$shared/models/project";
import { FileContentData } from "$shared/models/translation";
import { User } from "$shared/models/user";
import { filterActivitiesWithoutPath } from "./helpers";

export class ProjectPubllisher {
  private githubService: GithubService;
  private filesMap = new Map<string, FileContentData>();
  private githubSettings: GithubSettings;
  private activities: Record<string, Activity> = {};

  constructor(private project: Project, private user: User, private rootPath: string) {
    if (!this.project.installationId) {
      console.error('Project has no installation ID');
      throw 'Export failed: Project has no installation ID';
    }

    if (!this.project.githubSettings) {
      console.error('No github settings found for this project');
      throw 'Export failed: No github settings found for this project';
    }

    this.activities = filterActivitiesWithoutPath(project.activities);
    this.githubService = new GithubService(this.project.installationId);
    this.githubSettings = this.project.githubSettings;
  }

  async publish() {

  }

  // async publishFilesToGitHub(
  //   project: Project,
  //   title: string,
  //   description: string,
  //   files: FileContentData[],
  // ): Promise<string> {

  //   if (!project?.installationId) {
  //     console.error('Project has no installation ID');
  //     throw 'Export failed: Project has no installation ID';
  //   }

  //   if (!project.githubSettings) {
  //     console.error('No github settings found for this project');
  //     throw 'Export failed: No github settings found for this project';
  //   }

  //   const githubSettings = project.githubSettings;

  //   console.log('prepared new commit');

  //   const branchName = `onlook-${project.id}`;
  //   const branchFound = await createOrGetBranch(
  //     this.octokit,
  //     githubSettings.owner,
  //     githubSettings.repositoryName,
  //     githubSettings.baseBranch,
  //     branchName
  //   );

  //   if (!branchFound) {
  //     console.error('Failed to create or fetch branch');
  //     throw 'Export failed: Failed to create or fetch branch';
  //   }

  //   const commitId = await createCommit(
  //     this.octokit,
  //     githubSettings.owner,
  //     githubSettings.repositoryName,
  //     branchName,
  //     files,
  //     user,
  //     title
  //   );

  //   console.log('created new commit');

  //   const { pullRequestNumber, pullRequestUrl } = await createOrGetPullRequest(
  //     this.octokit,
  //     githubSettings.owner,
  //     githubSettings.repositoryName,
  //     githubSettings.baseBranch,
  //     title,
  //     description,
  //     branchName
  //   );

  //   console.log('created new pr: ', pullRequestUrl);
  //   return pullRequestUrl;
  // }

  async getFileFromActivity(activity: Activity) {
    if (!activity.path) {
      console.error('No path found for activity');
      return;
    }

    const pathInfo = getPathInfo(activity.path, this.githubSettings.rootPath);
    if (!this.filesMap.has(pathInfo.path)) {
      const fileContentData = await this.githubService.fetchFileFromPath(
        this.githubSettings.owner,
        this.githubSettings.repositoryName,
        this.githubSettings.baseBranch,
        pathInfo.path
      );
      if (!fileContentData) {
        console.error('File content not found for path: ', pathInfo.path);
      } else {
        this.filesMap.set(pathInfo.path, fileContentData);
      }
    }
  }
}