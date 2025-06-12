import { TServerSessionData } from '@shared-types/TServerSessionData';

import { getServerSessionDataApiUrl } from '@/config/routes';
import { jsonContentType } from '@/config/server';
import { APIError } from '@/shared/errors/APIError';
import { TServerDetailsResponse } from '@/types/server';

export async function getServerSessionData() {
  const url = getServerSessionDataApiUrl;
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
    });
    const { ok, status, statusText } = res;
    // TODO: Check if it's json response?
    let data: (TServerSessionData & TServerDetailsResponse) | undefined = undefined;
    let dataStr: string = '';
    try {
      dataStr = await res.text();
      data = JSON.parse(dataStr);
      if (!data) {
        throw new Error('Got empty data');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[api/methods/getServerSessionData] data parse error', error);
      // debugger; // eslint-disable-line no-debugger
      throw new Error('Cannot parse data');
    }
    if (!ok || status !== 200) {
      const errMsg = [`Error: ${status}`, data?.detail || statusText].filter(Boolean).join(': ');
      // eslint-disable-next-line no-console
      console.error('[api/methods/getServerSessionData] response error', errMsg, {
        ok,
        data,
        statusText,
        status,
        res,
        url,
      });
      debugger; // eslint-disable-line no-debugger
      throw new Error(errMsg);
    }
    return data as TServerSessionData;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/methods/getServerSessionData] caught error', {
      error,
      url,
    });
    // debugger; // eslint-disable-line no-debugger
    throw new APIError('Can not fetch server session data (see console error).');
  }
}
