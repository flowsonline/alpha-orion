import type { NextApiRequest, NextApiResponse } from 'next';
import { setCors } from '@/lib/cors';
import { getJobStatus } from '@/lib/eden';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (setCors(req, res)) return;
  const jobId = (req.query.jobId as string) || '';
  if (!jobId) return res.status(400).json({ error: 'Missing jobId' });
  const status = await getJobStatus(jobId);
  res.status(200).json(status);
}
