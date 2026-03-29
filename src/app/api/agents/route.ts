import { NextResponse } from 'next/server';

// Mock agents data
const agents = [
  {
    id: 'agent-primary',
    name: 'Primary Agent',
    type: 'primary',
    status: 'active',
    model: 'gpt-4-turbo',
    channels: ['telegram', 'slack'],
    createdAt: '2024-01-15T00:00:00.000Z',
    lastActive: new Date().toISOString(),
    memoryUsage: 256,
    tasksCompleted: 1247,
    uptime: 86400,
  },
  {
    id: 'agent-research',
    name: 'Research Assistant',
    type: 'subagent',
    status: 'idle',
    model: 'claude-3-opus',
    parentAgentId: 'agent-primary',
    channels: [],
    createdAt: '2024-02-01T00:00:00.000Z',
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    memoryUsage: 128,
    tasksCompleted: 432,
    uptime: 3600,
  },
  {
    id: 'agent-codegen',
    name: 'Code Generator',
    type: 'subagent',
    status: 'active',
    model: 'gpt-4o',
    parentAgentId: 'agent-primary',
    channels: ['discord'],
    createdAt: '2024-02-15T00:00:00.000Z',
    lastActive: new Date().toISOString(),
    memoryUsage: 192,
    tasksCompleted: 891,
    uptime: 7200,
  },
];

export async function GET() {
  return NextResponse.json({ agents });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newAgent = {
    id: `agent-${Date.now()}`,
    name: body.name || 'New Agent',
    type: 'subagent',
    status: 'idle',
    model: body.model || 'gpt-4-turbo',
    parentAgentId: body.parentAgentId,
    channels: [],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    memoryUsage: 0,
    tasksCompleted: 0,
    uptime: 0,
  };

  return NextResponse.json({ success: true, agent: newAgent });
}
