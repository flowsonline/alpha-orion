import type { NextApiRequest, NextApiResponse } from 'next';

export function setCors(req: NextApiRequest, res: NextApiResponse) {
  const allowed = process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) ?? ['*'];
  res.setHeader('Access-Control-Allow-Origin', allowed.includes('*') ? '*' : allowed.join(','));
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}
