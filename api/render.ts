// api/render.ts
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Simulated render endpoint
 * - Accepts POST with { prompt, tone, format, simulate }
 * - Returns { jobId, previewUrl } in sim mode
 * - Later: wire real Eden here when simulate=false
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, tone, format, simulate = true } = (req.body ?? {}) as {
      prompt?: string;
      tone?: string;
      format?: string;
      simulate?: boolean;
    };

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // SIM MODE (default)
    if (simulate) {
      const jobId = `sim-${Date.now()}`;

      // Public sample video (safe, hotlinkable) for preview
      const previewUrl =
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

      return res.status(200).json({ jobId, previewUrl });
    }

    // REAL MODE (later — Eden integration)
    return res.status(501).json({
      error: "Real render not wired yet. Set simulate=true for now.",
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Unexpected error" });
  }
}
