// api/status.ts
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Simulated status endpoint
 * - GET /api/status?jobId=sim-123
 * - Always returns succeeded for sim jobs
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const jobId = (req.query.jobId as string) || "";
  const isSim = jobId.startsWith("sim-");

  if (!jobId) {
    return res.status(400).json({ error: "Missing jobId" });
  }

  if (isSim) {
    // Same sample URL as render
    const url =
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
    return res.status(200).json({
      status: "succeeded",
      progress: 100,
      url,
    });
  }

  // Real jobs (later)
  return res.status(404).json({ error: "Unknown jobId in sim mode" });
}
