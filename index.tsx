import { useEffect, useMemo, useRef, useState } from 'react';

type JobStatus = { status: 'queued'|'processing'|'succeeded'|'failed'; progress: number; url?: string };

export default function Home() {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('15s ad for a new coffee shop launch, upbeat and friendly.');
  const [goal, setGoal] = useState('Traffic');
  const [industry, setIndustry] = useState('Digital Marketing');
  const [tone, setTone] = useState('Cinematic');
  const [formats, setFormats] = useState<string[]>(['Story (9:16)']);
  const [voiceover, setVoiceover] = useState(true);

  const [script, setScript] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus | null>(null);

  const phoneOrientation = useMemo(() => {
    if (formats.includes('Wide (16:9)')) return 'horizontal';
    if (formats.includes('Square (1:1)')) return 'square';
    return 'vertical';
  }, [formats]);

  useEffect(() => {
    if (!jobId) return;
    const iv = setInterval(async () => {
      const r = await fetch(`/api/status?jobId=${encodeURIComponent(jobId)}`);
      const j = await r.json();
      setStatus(j);
      if (j.status === 'succeeded' || j.status === 'failed') clearInterval(iv);
    }, 900);
    return () => clearInterval(iv);
  }, [jobId]);

  const toggleFormat = (f: string) => {
    setFormats((prev) => prev.includes(f) ? prev.filter(x => x!==f) : [...prev, f]);
  };

  const onGenerateCopy = async () => {
    const r = await fetch('/api/voiceover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const j = await r.json();
    setScript(j.script || '');
    setCaption(j.caption || '');
    setHashtags(j.hashtags || []);
    setStep(5);
  };

  const onRender = async () => {
    setStatus(null);
    const r = await fetch('/api/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, formats, voiceover })
    });
    const j = await r.json();
    setJobId(j.jobId);
    setStep(6);
  };

  return (
    <div style={styles.page}>
      <div style={styles.center}>
        <div style={styles.monitor}>
          <h1 style={{margin:0, fontSize:28}}>What’s your post about today?<span style={{color:'#6a6aff'}}> |</span></h1>
          <p style={{opacity:.8, marginTop:6}}>I’ll shape your copy & script from a short description.</p>

          {step===1 && (
            <div style={styles.card}>
              <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} style={styles.textarea}/>
              <div style={styles.row}>
                <button style={styles.primary} onClick={()=>setStep(2)}>Continue</button>
              </div>
            </div>
          )}

          {step===2 && (
            <div style={styles.card}>
              <div style={styles.rowWrap}>
                {['Traffic','Launch','Promo','Awareness'].map(g=>(
                  <Chip key={g} label={g} active={goal===g} onClick={()=>setGoal(g)}/>
                ))}
              </div>
              <div style={styles.rowWrap}>
                {['Digital Marketing','eCommerce','SaaS','Real Estate','Other'].map(ind=>(
                  <Chip key={ind} label={ind} active={industry===ind} onClick={()=>setIndustry(ind)}/>
                ))}
              </div>
              <div style={styles.row}>
                <button style={styles.secondary} onClick={()=>setStep(1)}>Back</button>
                <button style={styles.primary} onClick={()=>setStep(3)}>Continue</button>
              </div>
            </div>
          )}

          {step===3 && (
            <div style={styles.card}>
              <div style={styles.rowWrap}>
                {['Cinematic','Bold','Energetic','Elegant','Friendly'].map(t=>(
                  <Chip key={t} label={t} active={tone===t} onClick={()=>setTone(t)}/>
                ))}
              </div>
              <div style={{...styles.rowWrap, marginTop:10}}>
                {['Reel (9:16)','Story (9:16)','Square (1:1)','Wide (16:9)','Carousel (Photos)'].map(f=>(
                  <Chip key={f} label={f} active={formats.includes(f)} onClick={()=>toggleFormat(f)}/>
                ))}
              </div>
              <label style={{display:'flex',alignItems:'center',gap:8,marginTop:12}}>
                <input type="checkbox" checked={voiceover} onChange={e=>setVoiceover(e.target.checked)} /> Voiceover
              </label>
              <div style={styles.row}>
                <button style={styles.secondary} onClick={()=>setStep(2)}>Back</button>
                <button style={styles.primary} onClick={()=>setStep(4)}>Continue</button>
              </div>
            </div>
          )}

          {step===4 && (
            <div style={styles.card}>
              <p>Generate ad script, caption & hashtags based on your brief.</p>
              <div style={styles.row}>
                <button style={styles.secondary} onClick={()=>setStep(3)}>Back</button>
                <button style={styles.primary} onClick={onGenerateCopy}>Generate Copy</button>
              </div>
            </div>
          )}

          {step===5 && (
            <div style={styles.card}>
              <h3>Copy</h3>
              <div style={styles.copyBlock}><strong>Script:</strong> {script}</div>
              <div style={styles.copyBlock}><strong>Caption:</strong> {caption}</div>
              <div style={styles.copyBlock}><strong>Hashtags:</strong> {hashtags.join(' ')}</div>
              <div style={styles.row}>
                <button style={styles.secondary} onClick={()=>setStep(4)}>Back</button>
                <button style={styles.primary} onClick={onRender}>Render Video</button>
              </div>
            </div>
          )}

          {step===6 && (
            <div style={styles.card}>
              <h3>Preview</h3>
              <PhonePreview orientation={phoneOrientation} url={status?.url}/>
              <div style={{marginTop:10}}>
                <strong>Status:</strong> {status?.status ?? 'starting…'} — {status?.progress ?? 0}%
              </div>
              <div style={styles.row}>
                <button style={styles.secondary} onClick={()=>setStep(5)}>Back</button>
                <a style={{...styles.primary, textDecoration:'none'}} href={status?.url || '#'} target="_blank">Open Video</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Chip({label, active, onClick}:{label:string, active?:boolean, onClick?:()=>void}){
  return (
    <button onClick={onClick} style={{...styles.chip, ...(active?styles.chipActive:{}), cursor:'pointer'}}>{label}</button>
  )
}

function PhonePreview({orientation, url}:{orientation:'vertical'|'horizontal'|'square', url?:string}){
  const container: any = {position:'relative', width:340, height:680};
  const videoStyle: any = {position:'absolute', left:30+8, top:70+8, width:280-16, height:540-16, objectFit:'cover', background:'#0b0f14', borderRadius:8};
  if (orientation==='horizontal'){ videoStyle.objectFit='contain' }
  if (orientation==='square'){ videoStyle.objectFit='contain' }
  return (
    <div style={container}>
      <img src="/phone-shell.svg" style={{width:'100%',height:'100%'}}/>
      {url ? <video src={url} autoPlay muted controls style={videoStyle}/> : <div style={{...videoStyle, display:'grid', placeItems:'center', color:'#9aa4b2'}}>Waiting…</div>}
    </div>
  )
}

const styles:any = {
  page:{minHeight:'100vh', background:'radial-gradient(1200px 800px at 50% -100px, #0f1a26 0%, #070b10 60%, #05070a 100%)', color:'#EAF0FF'},
  center:{display:'grid', placeItems:'center', padding:'60px 20px'},
  monitor:{maxWidth:980, width:'100%', border:'1px solid #1a2233', background:'linear-gradient(180deg,#0b1018,#0a0f16)', boxShadow:'0 0 40px rgba(106,106,255,.15)', borderRadius:16, padding:24},
  card:{marginTop:14, border:'1px solid #243049', borderRadius:12, padding:16, background:'#0e141f'},
  textarea:{width:'100%', height:120, borderRadius:10, border:'1px solid #2c3a57', background:'#0b111a', color:'#e7efff', padding:12},
  row:{display:'flex', gap:12, alignItems:'center', justifyContent:'flex-end', marginTop:12},
  rowWrap:{display:'flex', flexWrap:'wrap', gap:8},
  chip:{padding:'10px 14px', borderRadius:999, border:'1px solid #2c3a57', background:'#0b111a', color:'#cfe0ff'},
  chipActive:{border:'1px solid #6a6aff', background:'rgba(106,106,255,.15)'},
  primary:{background:'linear-gradient(90deg,#6a6aff,#8a8aff)', color:'#05070a', padding:'10px 16px', borderRadius:10, border:'none', fontWeight:700},
  secondary:{background:'transparent', color:'#cfe0ff', padding:'10px 16px', borderRadius:10, border:'1px solid #2c3a57'},
  copyBlock:{background:'#0b111a', border:'1px solid #2c3a57', borderRadius:10, padding:10, margin:'8px 0'}
}
