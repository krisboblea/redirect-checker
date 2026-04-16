import { sendGAEvent } from '@next/third-parties/google';

export const trackEvent = (eventName, params = {}) => {
    sendGAEvent('event', eventName, params);
};
