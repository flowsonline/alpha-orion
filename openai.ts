export type VoiceResult = { script: string; caption: string; hashtags: string[] };

export async function generateVoiceover(prompt: string): Promise<VoiceResult> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    // Fallback so flow works without key
    return {
      script: `Narration: ${prompt}. Engaging, concise, and upbeat.`,
      caption: `✨ ${prompt} — Let’s make it happen!`,
      hashtags: ['#orion', '#flows', '#marketing', '#ai']
    };
  }

  // minimal, safe call (can be expanded later)
  try {
    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You write short ad scripts and social captions.' },
        { role: 'user', content: `Create a 15-45s ad script, plus a short caption and 8 hashtags.
Brief: ${prompt}` }
      ]
    };
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    const text: string = j?.choices?.[0]?.message?.content ?? 'Script unavailable.';
    const lines = text.split('\n').map(s=>s.trim()).filter(Boolean);
    const script = lines[0] || text;
    const caption = lines[1] || 'New drop by Orion!';
    const tags = (lines.slice(2).join(' ') || '#orion #flows').split(/\s+/).slice(0,8);
    return { script, caption, hashtags: tags };
  } catch {
    return {
      script: `Narration: ${prompt}. Engaging, concise, and upbeat.`,
      caption: `✨ ${prompt} — Let’s make it happen!`,
      hashtags: ['#orion', '#flows', '#marketing', '#ai']
    };
  }
}
