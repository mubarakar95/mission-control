import { NextResponse } from 'next/server';

export async function GET() {
  // Simulated gateway status response
  const status = {
    online: true,
    version: '0.4.9',
    uptime: Math.floor(Math.random() * 86400) + 3600,
    responseTime: Math.floor(Math.random() * 50) + 10,
    lastCheck: new Date().toISOString(),
    agents: {
      active: 2,
      total: 3,
    },
    cron: {
      running: 2,
      total: 3,
    },
    memory: {
      used: Math.floor(Math.random() * 512) + 256,
      total: 1024,
    },
  };

  return NextResponse.json(status);
}

export async function POST(request: Request) {
  const body = await request.json();
  const action = body.action;

  switch (action) {
    case 'start':
      return NextResponse.json({ success: true, message: 'Gateway starting...' });
    case 'stop':
      return NextResponse.json({ success: true, message: 'Gateway stopping...' });
    case 'restart':
      return NextResponse.json({ success: true, message: 'Gateway restarting...' });
    default:
      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  }
}
