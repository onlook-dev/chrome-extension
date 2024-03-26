import { MixpanelActions } from '$lib/mixpanel/client';
import { identifyUser, trackEvent } from '$lib/mixpanel/index.server';
import { json } from '@sveltejs/kit';

export async function POST({ request, getClientAddress }) {
  const { action, id, eventName, data } = await request.json();
  data.ip = getClientAddress();
  switch (action) {
    case MixpanelActions.IDENTIFY_USER:
      identifyUser(id, data);
      return json({ status: 200 });
    case MixpanelActions.TRACK_EVENT:
      trackEvent(id, eventName, data);
      return json({ status: 200 });
    default:
      return json({ status: 404, message: 'Action not found' });
  }
}