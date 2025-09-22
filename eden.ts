export type Job = { jobId: string };
export type JobStatus = { status: 'queued'|'processing'|'succeeded'|'failed'; progress: number; url?: string };

export async function startVideoRender(_: { prompt: string; formats: string[]; voiceover: boolean }): Promise<Job> {
  const jobId = 'job-' + Date.now();
  return { jobId };
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const ts = Number(jobId.replace('job-','')) || Date.now();
  const elapsed = Date.now() - ts;
  const total = 7000; // 7s pretend render
  const progress = Math.min(100, Math.round((elapsed/total)*100));
  if (elapsed < total*0.2) return { status: 'queued', progress };
  if (elapsed < total) return { status: 'processing', progress };
  return {
    status: 'succeeded',
    progress: 100,
    url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4'
  };
}
