import { mixpanelToken } from '$lib/utils/env';
import { getActiveUser } from '$lib/utils/localstorage';
import mixpanel from 'mixpanel-browser';

export function initializeMixpanel() {
    try {
        mixpanel.init(mixpanelToken, { track_pageview: true });
        getActiveUser().then(user => {
            if (user) {
                identifyUser(user.id);
            }
        })
        console.log('Initialized mixpanel', mixpanelToken);
    } catch (error) {
        console.error('Error initializing mixpanel', error);
    }
}

export function identifyUser(id: string) {
    try {
        mixpanel.identify(id);
    } catch (error) {
        console.error('Error identifying user', error);
    }

}

export function trackEvent(eventName: string, properties: Record<string, any>) {
    try {
        mixpanel.track(eventName, properties);
        console.log('Tracked event', eventName, properties);
    } catch (error) {
        console.error('Error tracking event', error);
    }
}