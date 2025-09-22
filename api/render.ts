import type { NextApiRequest, NextApiResponse } from 'next';
import { setCors } from '@/lib/cors';
import { startVideoRender } from '@/lib/eden';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (setCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, formats, voiceover } = req.body || {};
  const job = await startVideoRender({ prompt, formats, voiceover });
  res.status(200).json(job);
}
