import { getCheckedApiUrl } from '@/config/routes';
import { jsonContentType } from '@/config/server';
import { APIError } from '@/shared/errors/APIError';
import { TServerDetailsResponse } from '@/types/server';

interface TServerData {
  /** List of checked record ids... */
  list: number[];
}

export async function getCheckedRecordsData() {
  const url = getCheckedApiUrl;
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
    let data: (TServerData & TServerDetailsResponse) | undefined = undefined;
    let dataStr: string = '';
    try {
      dataStr = await res.text();
      data = JSON.parse(dataStr);
      if (!data) {
        throw new Error('Got empty data');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[api/methods/getCheckedRecordsData] data parse error', error);
      // debugger; // eslint-disable-line no-debugger
      throw new Error('Cannot parse data');
    }
    if (!ok || status !== 200) {
      const errMsg = [`Error: ${status}`, data?.detail || statusText].filter(Boolean).join(': ');
      // eslint-disable-next-line no-console
      console.error('[api/methods/getCheckedRecordsData] response error', errMsg, {
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
    return data.list || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/methods/getCheckedRecordsData] caught error', {
      error,
      url,
    });
    // debugger; // eslint-disable-line no-debugger
    throw new APIError('Can not fetch records data (see console error).');
  }
}
