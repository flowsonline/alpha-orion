# Orion Studio — MVP (Vercel)
Minimal, working MVP for Orion Social Media Studio.

## Deploy
1. Create a **new GitHub repo** and upload the **contents of this folder** (keep the structure unchanged).
2. In **Vercel → New Project → Import** that repo.
   - Framework Preset: **Next.js**
   - Root Directory: `./`
3. (Optional) Set env vars:
   - `OPENAI_API_KEY`
   - `EDEN_API_KEY`
   - `ALLOWED_ORIGINS` (comma-separated)
4. Deploy. Visit `/`.

## Endpoints
- `GET /api/health` – sanity check.
- `POST /api/voiceover` – returns `{ script, caption, hashtags }`.
- `POST /api/render` – returns `{ jobId }` (simulated now).
- `GET /api/status?jobId=...` – returns `{ status, progress, url? }`.

## Notes
- Render is simulated for now (no external calls); we can swap `lib/eden.ts` to hit Eden AI later.
- Voiceover uses OpenAI if the key is set, otherwise returns a safe fallback so the flow works without secrets.
