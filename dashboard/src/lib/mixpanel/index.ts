import mixpanel from 'mixpanel-browser';
import { mixpanelToken } from '$lib/utils/env';

export function initMixpanel() {
  mixpanel.init(mixpanelToken, { debug: true, track_pageview: true, persistence: 'localStorage' });
}

export function identifyUser(userId: string) {
  mixpanel.identify(userId);
}

export function clearUser() {
  mixpanel.reset();
}

export function trackEvent(eventName: string, properties: Record<string, any>) {
  mixpanel.track(eventName, properties);
}