export enum MixpanelActions {
  IDENTIFY_USER = 'IDENTIFY_USER',
  TRACK_EVENT = 'TRACK_EVENT'
}

export async function identifyMixpanelUser(id: string, data: {}) {
  callMixpanelEndpoint({ action: MixpanelActions.IDENTIFY_USER, id, data });
}


export async function trackMixpanelEvent(id: string, eventName: string, data: {}) {
  callMixpanelEndpoint({ action: MixpanelActions.TRACK_EVENT, id, eventName, data });
}

export async function callMixpanelEndpoint(body: { action: MixpanelActions, id: string, eventName?: string, data: {} }) {
  const response = await fetch('/api/mixpanel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}