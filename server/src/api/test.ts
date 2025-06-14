import { Request, Response } from 'express';

/** API method: test */
export async function test(req: Request, res: Response) {
  const data = {
    test: 1,
    a: 1,
  };
  res.end(JSON.stringify(data));
}
