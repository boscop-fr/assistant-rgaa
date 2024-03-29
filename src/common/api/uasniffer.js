export const UA = window.navigator.userAgent;

export const isFirefox = (ua = UA) => ua.indexOf('Firefox') !== -1;
