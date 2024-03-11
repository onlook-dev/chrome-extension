import type { Activity } from '$shared/models/activity';
import type { Octokit } from '@octokit/core';
import type { TreeItem } from '$shared/models/github';
import type {
	FileContentData,
	TranslationInput,
	TranslationOutput
} from '$shared/models/translation';
import { getTranslationsFromServer } from '$lib/translation/translation';
import { getTranslationInput, updateContentChunk } from '$shared/translation';
import { fetchFileFromPath, getPathInfo } from './files';
import type { User } from '$shared/models/user';
import cloneDeep from 'lodash/cloneDeep';

export async function prepareCommit(
	octokit: Octokit,
	owner: string,
	repo: string,
	branch: string,
	rootPath: string,
	activities: Record<string, Activity>
): Promise<{
	oldMap: Map<string, FileContentData>;
	newMap: Map<string, FileContentData>;
}> {
	const fileDataMap = new Map<string, FileContentData>();
	const fetchPromises: Promise<void>[] = [];
	const translationInputs: TranslationInput[] = [];

	// Get corresponding File for each activity
	Object.values(activities).forEach((activity: Activity) => {
		if (!activity.path) {
			console.error('No path found for activity');
			return;
		}
		const pathInfo = getPathInfo(activity.path, rootPath);
		if (!fileDataMap.has(pathInfo.path)) {
			const fetchPromise = fetchFileFromPath(octokit, owner, repo, branch, pathInfo.path).then(
				(fileContentData: FileContentData | undefined) => {
					if (!fileContentData) {
						console.error('File content not found for path: ', pathInfo.path);
					} else {
						fileDataMap.set(pathInfo.path, fileContentData);
					}
				}
			);
			fetchPromises.push(fetchPromise);
		}
	});

	await Promise.all(fetchPromises);

	console.log('fileDataMap before', fileDataMap);

	// Get correponding TranslationInput for each activities
	Object.values(activities).forEach((activity: Activity) => {
		if (!activity.path) {
			console.error('No path found for activity');
			return;
		}
		const pathInfo = getPathInfo(activity.path, rootPath);
		const fileContentData = fileDataMap.get(pathInfo.path);
		if (!fileContentData) {
			console.error('No file content found for activity');
			return;
		}

		const translationInput = getTranslationInput(fileContentData.content, pathInfo, activity);
		translationInputs.push(translationInput);
	});

	console.log('translationInputs', translationInputs);

	// Get translations from server
	const translationOutput = await getTranslationsFromServer(translationInputs);
	console.log('translationOutput', translationOutput);

	const clonedFileDataMap = new Map();
	fileDataMap.forEach((value, key) => {
		clonedFileDataMap.set(key, cloneDeep(value));
	});

	// Write translations back into files
	translationOutput.forEach((translation: TranslationOutput) => {
		const fileContentData = fileDataMap.get(translation.pathInfo.path);
		if (!fileContentData) {
			console.error('No file content found for translation');
			return;
		}

		const newContent = updateContentChunk(
			fileContentData.content,
			translation.codeChunk,
			translation.pathInfo
		);
		fileContentData.content = newContent;
	});

	console.log('fileDataMap after', fileDataMap);
	return {
		oldMap: clonedFileDataMap,
		newMap: fileDataMap,
	};
}

export async function createCommit(
	octokit: Octokit,
	owner: string,
	repo: string,
	branch: string,
	files: FileContentData[],
	user: User,
	title: string
): Promise<string> {
	try {
		// Preparing the tree for the commit
		const trees: TreeItem[] = files.map((file) => ({
			path: file.path,
			mode: '100644', // mode is explicitly typed
			type: 'blob', // type is explicitly typed
			content: file.content
		}));

		// Getting the SHA of the latest commit on the branch
		const latestCommit = await octokit.request(`GET /repos/{owner}/{repo}/git/ref/{ref}`, {
			owner,
			repo,
			ref: `heads/${branch}`
		});
		const latestCommitSha = latestCommit.data.object.sha;

		// Creating a new tree in the repository
		const treeResponse = await octokit.request(`POST /repos/{owner}/{repo}/git/trees`, {
			owner,
			repo,
			tree: trees,
			base_tree: latestCommitSha // Use the latest commit SHA as the base tree
		});

		// Creating the commit pointing to the new tree
		const commitResponse = await octokit.request(`POST /repos/{owner}/{repo}/git/commits`, {
			owner,
			repo,
			message: title,
			tree: treeResponse.data.sha,
			parents: [latestCommitSha],
			author: {
				name: user.name,
				email: user.email,
				date: new Date().toISOString()
			},
			headers: {
				'X-GitHub-Api-Version': '2022-11-28'
			}
		});

		// Updating the reference of the branch to point to the new commit
		await octokit.request(`PATCH /repos/{owner}/{repo}/git/refs/heads/${branch}`, {
			owner,
			repo,
			sha: commitResponse.data.sha
		});

		return commitResponse.data.sha;
	} catch (error) {
		console.error('Failed to create commit:', error);
		return 'failed to create commit';
	}
}
