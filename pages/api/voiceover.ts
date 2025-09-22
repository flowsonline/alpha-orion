import type { NextApiRequest, NextApiResponse } from 'next';
import { setCors } from '@/lib/cors';
import { generateVoiceover } from '@/lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (setCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'Missing prompt' });
  const data = await generateVoiceover(prompt);
  res.status(200).json(data);
}
