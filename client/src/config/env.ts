export const isDev = import.meta.env.DEV; // process.env.NODE_ENV === 'development';
export const isProd = !isDev;

export const originHost =
  window.location.origin || window.location.protocol + '//' + window.location.host;

export const rootHost = isProd ? originHost : 'http://localhost:51732';
export const apiHost = isProd ? originHost : 'http://localhost:3000';
export const apiUrl = apiHost + '/api';
