import type { PathInfo } from "$lib/github/files";
import type { Activity } from "$shared/models/activity";
import type { TranslationInput } from "$shared/models/translation";
import { activityToTranslationInput, getContentClass, updateContentClass } from "$shared/translation";

export async function getTranslationsFromServer(inputs: TranslationInput[]): Promise<TranslationOutput[]> {
  const messages = { role: 'user', content: `json: ${JSON.stringify({ "changes": inputs })}` };
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  console.log('data', data);
  return JSON.parse(data.choices[0].message.content).changes;
}

export function getTranslationInput(content: string, pathInfo: PathInfo, activity: Activity): TranslationInput {
  const newContent = content.split('\n').slice(pathInfo.startLine - 1, pathInfo.endLine).join('\n');
  const currentClasses = getContentClass(newContent);
  const translationInput = activityToTranslationInput(activity, pathInfo, currentClasses,);
  return translationInput;
}

export function updateContentChunk(content: string, pathInfo: PathInfo, newClass: string): string {
  let newContent = content.split('\n').slice(pathInfo.startLine - 1, pathInfo.endLine).join('\n');
  newContent = updateContentClass(newContent, newClass);
  // Merge new content back into content
  const contentLines = content.split('\n');
  contentLines.splice(pathInfo.startLine - 1, pathInfo.endLine - pathInfo.startLine + 1, newContent);
  return contentLines.join('\n');
}
