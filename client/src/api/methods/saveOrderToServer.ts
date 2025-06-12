import { saveOrderApiUrl } from '@/config/routes';
import { jsonContentType } from '@/config/server';
import { APIError } from '@/shared/errors/APIError';
import { TServerDetailsResponse } from '@/types/server';

interface TParams {
  moveId: number;
  overId: number;
}

export async function saveOrderToServer(params: TParams) {
  const url = saveOrderApiUrl;
  const method = 'POST';
  const headers = {
    Accept: jsonContentType,
    'Content-Type': jsonContentType,
  };
  try {
    const res = await fetch(url, {
      method,
      headers,
      credentials: 'include', // Allow to pass cookies (session, csrf etc)
      body: JSON.stringify(params),
    });
    const { ok, status, statusText } = res;
    // TODO: Check if it's json response?
    let data: TServerDetailsResponse | undefined = undefined;
    let dataStr: string = '';
    try {
      dataStr = await res.text();
      data = JSON.parse(dataStr);
    } catch (
      _e // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
      // NOOP // TODO: To generate an error?
    }
    if (!ok || status !== 200) {
      const errMsg = [`Error: ${status}`, data?.detail || statusText].filter(Boolean).join(': ');
      // eslint-disable-next-line no-console
      console.error('[api/methods/saveOrderToServer] response error', errMsg, {
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[api/methods/saveOrderToServer] caught error', {
      error,
      url,
    });
    // debugger; // eslint-disable-line no-debugger
    throw new APIError('Can not save records order to server (see console error).');
  }
}
