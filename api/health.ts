import type { NextApiRequest, NextApiResponse } from 'next';
import { setCors } from '@/lib/cors';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (setCors(req, res)) return;
  res.status(200).json({ ok: true, time: new Date().toISOString() });
}
