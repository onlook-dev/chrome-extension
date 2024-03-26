import Mixpanel from 'mixpanel';
import { mixpanelToken } from '$lib/utils/env';

const mixpanel = Mixpanel.init(mixpanelToken);

export function identifyUser(id: string, properties: Record<string, any>) {
  mixpanel.people.set(id, {
    ...properties
  });
}

export function trackEvent(id: string, eventName: string, properties: Record<string, any>) {
  mixpanel.track(eventName, {
    distinct_id: id,
    ...properties
  });
}