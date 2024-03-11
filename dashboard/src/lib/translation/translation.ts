import type { TranslationInput, TranslationOutput } from "$shared/models/translation";

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
    throw new Error(`Network response was not ok. Response: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return JSON.parse(data).changes;
}
