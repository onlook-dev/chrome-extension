import { userStore } from "$lib/utils/store";
import { get } from "svelte/store";
import { auth } from "$lib/firebase";
import { USER_ID_KEY } from "$lib/utils/constants";

export enum MixpanelActions {
  IDENTIFY_USER = 'IDENTIFY_USER',
  TRACK_EVENT = 'TRACK_EVENT'
}

export async function identifyMixpanelUser(id: string, data: {}) {
  try {
    return await callMixpanelEndpoint({ action: MixpanelActions.IDENTIFY_USER, id, data });
  } catch (error) {
    console.error('Error identifying mixpanel user', error);
  }
}

export async function trackMixpanelEvent(eventName: string, data: {}) {
  try {
    const userId = localStorage.getItem(USER_ID_KEY) ?? get(userStore)?.id ?? auth.currentUser?.uid ?? 'unknown';
    return await callMixpanelEndpoint({ action: MixpanelActions.TRACK_EVENT, id: userId, eventName, data });
  } catch (error) {
    console.error('Error recording mixpanel event', error);
  }
}

async function callMixpanelEndpoint(body: { action: MixpanelActions, id: string, eventName?: string, data: {} }) {
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