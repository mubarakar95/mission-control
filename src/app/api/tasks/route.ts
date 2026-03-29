import { NextResponse } from 'next/server';

// Mock tasks data
let tasks = [
  {
    id: 'task-1',
    title: 'Implement vector search',
    description: 'Add semantic search capability to memory system',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'agent-primary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['feature', 'ai'],
  },
  {
    id: 'task-2',
    title: 'Fix cron job scheduler',
    description: 'Resolve timing issues with recurring tasks',
    status: 'review',
    priority: 'critical',
    assigneeId: 'agent-codegen',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['bug', 'cron'],
  },
  {
    id: 'task-3',
    title: 'Add Discord integration',
    description: 'Connect agent to Discord server',
    status: 'backlog',
    priority: 'medium',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['feature', 'integration'],
  },
  {
    id: 'task-4',
    title: 'Optimize memory usage',
    description: 'Reduce memory footprint by 20%',
    status: 'done',
    priority: 'medium',
    assigneeId: 'agent-research',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['optimization'],
  },
];

export async function GET() {
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newTask = {
    id: `task-${Date.now()}`,
    title: body.title,
    description: body.description || '',
    status: body.status || 'backlog',
    priority: body.priority || 'medium',
    assigneeId: body.assigneeId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: body.tags || [],
  };

  tasks.push(newTask);
  return NextResponse.json({ success: true, task: newTask });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;
  
  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, ...updates, updatedAt: new Date().toISOString() }
      : task
  );

  const updatedTask = tasks.find((t) => t.id === id);
  return NextResponse.json({ success: true, task: updatedTask });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  tasks = tasks.filter((task) => task.id !== id);
  return NextResponse.json({ success: true });
}
