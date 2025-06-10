import type { APIConfig } from '@shared-types/APIConfig';

import { configApiUrl } from '@/config/routes';
import { APIError } from '@/shared/errors/APIError';

const jsonContentType = 'application/json; charset=utf-8';

export async function getConfig() {
  const url = configApiUrl;
  const method = 'GET';
  const headers = {
    Accept: jsonContentType,
    'Content-Type': jsonContentType,
    // 'Accept-Language': 'en',
  };
  try {
    const res = await fetch(url, {
      method,
      headers,
      credentials: 'include', // Allow to pass cookies (session, csrf etc)
      // body: requestData ? JSON.stringify(requestData) : null,
    });
    const { ok, status, statusText } = res;
    // TODO: Check if it's json response?
    let data: (unknown & { detail?: string }) | undefined = undefined;
    let dataStr: string = '';
    try {
      dataStr = await res.text();
      data = JSON.parse(dataStr);
    } catch (
      _e // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
      // NOOP
      // TODO: To generate an error?
    }
    if (!ok || status !== 200) {
      const errMsg = ['Error:' + ' ' + status, data?.detail || statusText]
        .filter(Boolean)
        .join(': ');
      // eslint-disable-next-line no-console
      console.error('[api/methods/getConfig:Effect] fetch: not ok error', errMsg, {
        ok,
        data,
        statusText,
        status,
        res,
        url,
        // requestData,
        // method,
        // headers,
      });
      debugger; // eslint-disable-line no-debugger
      throw new Error(errMsg);
    }
    /* console.log('[api/methods/getConfig:Effect] fetch: result', {
     *   res,
     *   data,
     *   dataStr,
     * });
     */
    return data as APIConfig;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/methods/getConfig:Effect] fetch: caught error', {
      error,
      url,
    });
    // debugger; // eslint-disable-line no-debugger
    throw new APIError('Can not receive config data (see console error).');
  }
}
