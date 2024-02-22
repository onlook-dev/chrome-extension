import type { EditEvent } from "$lib/types/editor";
import type { Changes } from "$lib/types/translation";

export function prepareChanges(editEvents: EditEvent[]): Changes[] {
  const changesMap = new Map<string, Changes>();

  editEvents.forEach(({ detail }) => {
    const { path, selector, newVal } = detail;
    const [filePath, startLine, endLine] = path.split(':');
    console.log('filePath:', filePath);
    const [shortPath] = filePath.split('/src/').slice(-1)
    console.log('shortPath:', shortPath);
    console.log('startLine:', startLine);
    console.log('endLine:', endLine);
    const key = `${filePath}:${selector}`;

    const newValString = Object.entries(newVal)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");

    if (!changesMap.has(key)) {
      changesMap.set(key, {
        path: shortPath,
        selector,
        newValues: [newValString],
        startLine,
        endLine,
        currentValue: getSourceCode({}),
      });
    } else {
      const existingChange = changesMap.get(key);
      existingChange.newValues.push(newValString);
    }
  });

  return Array.from(changesMap.values());
}


// fetch file here
export function getSourceCode(githubDetails: any) {
  const currentValue = `GITHUB_URL/{<org_name>}/{repo_name}/{path}#L{startLine}-L{endLine}`
  return currentValue;
}
