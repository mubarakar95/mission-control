// Mission Control Types

// Agent Types
export interface Agent {
  id: string;
  name: string;
  type: 'primary' | 'subagent';
  status: 'active' | 'idle' | 'offline' | 'error';
  model: string;
  parentAgentId?: string;
  channels: string[];
  createdAt: Date;
  lastActive: Date;
  memoryUsage: number;
  tasksCompleted: number;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
}

// Cron Job Types
export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  command: string;
  status: 'running' | 'paused' | 'error';
  lastRun?: Date;
  nextRun?: Date;
  runHistory: CronRunHistory[];
}

export interface CronRunHistory {
  id: string;
  jobId: string;
  startTime: Date;
  endTime?: Date;
  status: 'success' | 'failed' | 'running';
  output?: string;
  error?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentId: string;
  attachments?: FileAttachment[];
  model?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

// Usage & Cost Types
export interface UsageData {
  date: string;
  tokens: number;
  cost: number;
  model: string;
  agentId: string;
}

export interface ModelUsage {
  model: string;
  totalTokens: number;
  totalCost: number;
  requests: number;
  percentage: number;
}

// Memory Types
export interface MemoryEntry {
  id: string;
  agentId: string;
  type: 'long_term' | 'journal' | 'conversation';
  content: string;
  embedding?: number[];
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

// Channel Types
export interface Channel {
  id: string;
  type: 'telegram' | 'discord' | 'whatsapp' | 'signal' | 'slack';
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, unknown>;
  agentIds: string[];
}

// Security Types
export interface SecurityAudit {
  id: string;
  type: 'credential_exposure' | 'permission_issue' | 'vulnerability' | 'misconfiguration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  status: 'open' | 'fixed' | 'ignored';
  detectedAt: Date;
}

// System Resources
export interface SystemResources {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
}

// Gateway Health
export interface GatewayHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  lastCheck: Date;
  responseTime: number;
  errors: string[];
}

// Model Configuration
export interface ModelConfig {
  id: string;
  provider: string;
  name: string;
  apiKey?: string;
  baseUrl?: string;
  fallbackChain: string[];
  assignedAgents: string[];
  rateLimit: number;
}

// Document Types
export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modifiedAt: Date;
  content?: string;
}

// Diagnostic Types
export interface DiagnosticCheck {
  id: string;
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  fixAvailable: boolean;
  fixCommand?: string;
}
