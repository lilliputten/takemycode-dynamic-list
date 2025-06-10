import { TRecordsData } from '@shared-types/TRecordsData';

import { dataApiUrl } from '@/config/routes';
import { APIError } from '@/shared/errors/APIError';

const jsonContentType = 'application/json; charset=utf-8';

interface TParams {
  count?: number;
  start?: number;
}

export async function fetchServerData(params: TParams = {}) {
  const { count, start } = params;
  const query = [
    // Construct url query
    count && `count=${count}`,
    start && `start=${start}`,
  ]
    .filter(Boolean)
    .join('&');
  const url = [
    // Construct url
    dataApiUrl,
    query,
  ]
    .filter(Boolean)
    .join('?');
  const method = 'GET';
  const headers = {
    Accept: jsonContentType,
    'Content-Type': jsonContentType,
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
    let data: (TRecordsData & { detail?: string }) | undefined = undefined;
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
      const errMsg = [`Error: ${status}`, data?.detail || statusText].filter(Boolean).join(': ');
      // eslint-disable-next-line no-console
      console.error('[api/methods/fetchServerData:Effect] fetch: not ok error', errMsg, {
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
    return data as TRecordsData;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/methods/fetchServerData:Effect] fetch: caught error', {
      error,
      url,
    });
    // debugger; // eslint-disable-line no-debugger
    throw new APIError('Can not fetch records data (see console error).');
  }
}
