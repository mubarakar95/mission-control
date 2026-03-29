import { NextResponse } from 'next/server';

// Generate recent activity
function generateActivity(limit: number = 20) {
  const activities = [];
  const types = ['success', 'warning', 'error', 'info'] as const;
  const messages = [
    { type: 'success', message: 'Task completed successfully', agent: 'Primary Agent' },
    { type: 'info', message: 'New message received on Telegram', agent: 'Primary Agent' },
    { type: 'success', message: 'Code deployed to production', agent: 'Code Generator' },
    { type: 'info', message: 'Memory cleanup completed', agent: 'Primary Agent' },
    { type: 'warning', message: 'Rate limit approaching', agent: 'Research Assistant' },
    { type: 'success', message: 'Report generated', agent: 'Primary Agent' },
    { type: 'error', message: 'API connection timeout', agent: 'Research Assistant' },
    { type: 'info', message: 'New session started', agent: 'Primary Agent' },
    { type: 'success', message: 'File uploaded to workspace', agent: 'Code Generator' },
    { type: 'info', message: 'Cron job executed', agent: 'System' },
  ];

  for (let i = 0; i < limit; i++) {
    const item = messages[Math.floor(Math.random() * messages.length)];
    activities.push({
      id: `activity-${Date.now()}-${i}`,
      type: item.type,
      message: item.message,
      agent: item.agent,
      timestamp: new Date(Date.now() - i * 60000 * Math.floor(Math.random() * 30 + 1)).toISOString(),
      metadata: Math.random() > 0.7 ? { duration: Math.floor(Math.random() * 5000) + 100 } : undefined,
    });
  }

  return activities;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const type = searchParams.get('type');

  let activities = generateActivity(limit);

  if (type && ['success', 'warning', 'error', 'info'].includes(type)) {
    activities = activities.filter((a) => a.type === type);
  }

  return NextResponse.json({
    activities,
    total: activities.length,
    timestamp: new Date().toISOString(),
  });
}
