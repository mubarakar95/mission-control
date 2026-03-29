import { NextResponse } from 'next/server';

// Mock cron jobs data
let cronJobs = [
  {
    id: 'cron-1',
    name: 'Daily Report Generation',
    schedule: '0 8 * * *',
    command: 'generate-report --type daily',
    status: 'running',
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    nextRun: new Date(Date.now() + 82800000).toISOString(),
    runHistory: [
      { id: 'run-1', startTime: new Date(Date.now() - 3600000).toISOString(), status: 'success', duration: 2.3 },
      { id: 'run-2', startTime: new Date(Date.now() - 90000000).toISOString(), status: 'success', duration: 2.1 },
    ],
  },
  {
    id: 'cron-2',
    name: 'Memory Cleanup',
    schedule: '0 0 * * 0',
    command: 'cleanup-memory --max-age 30d',
    status: 'running',
    lastRun: new Date(Date.now() - 172800000).toISOString(),
    nextRun: new Date(Date.now() + 432000000).toISOString(),
    runHistory: [],
  },
  {
    id: 'cron-3',
    name: 'Backup Database',
    schedule: '0 2 * * *',
    command: 'backup-db --compress',
    status: 'paused',
    lastRun: new Date(Date.now() - 86400000).toISOString(),
    runHistory: [],
  },
];

export async function GET() {
  return NextResponse.json({ cronJobs });
}

export async function POST(request: Request) {
  const body = await request.json();
  const action = body.action;
  const jobId = body.jobId;

  if (action === 'pause') {
    cronJobs = cronJobs.map((job) =>
      job.id === jobId ? { ...job, status: 'paused' } : job
    );
    return NextResponse.json({ success: true });
  }

  if (action === 'resume') {
    cronJobs = cronJobs.map((job) =>
      job.id === jobId ? { ...job, status: 'running' } : job
    );
    return NextResponse.json({ success: true });
  }

  if (action === 'test') {
    return NextResponse.json({ 
      success: true, 
      message: 'Test run initiated',
      jobId 
    });
  }

  // Create new cron job
  const newJob = {
    id: `cron-${Date.now()}`,
    name: body.name,
    schedule: body.schedule,
    command: body.command,
    status: 'running',
    lastRun: null,
    nextRun: null,
    runHistory: [],
  };

  cronJobs.push(newJob);
  return NextResponse.json({ success: true, job: newJob });
}
