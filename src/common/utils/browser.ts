// navigator, as window is undefined in service workers.
const UA = navigator.userAgent;

export const isFirefox = (ua = UA) => ua.indexOf('Firefox') !== -1;
