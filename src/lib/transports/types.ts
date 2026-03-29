/**
 * Transport Types
 * Shared types for transport layer
 */

export type TransportType = 'http' | 'cli';

export interface TransportConfig {
  type: TransportType;
  gatewayUrl?: string;
  gatewayToken?: string;
  binaryPath?: string;
  timeout?: number;
}

export interface TransportResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export interface TransportRequest {
  command: string;
  args?: string[];
  input?: string;
  timeout?: number;
}

export interface GatewayStatus {
  online: boolean;
  version?: string;
  uptime?: number;
  lastCheck: Date;
  responseTime?: number;
  error?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  type: 'primary' | 'subagent';
  status: 'active' | 'idle' | 'offline' | 'error';
  model: string;
  parentAgentId?: string;
  channels: string[];
  memoryUsage: number;
  tasksCompleted: number;
  lastActive: Date;
}

export interface MemoryEntry {
  id: string;
  agentId: string;
  type: 'long_term' | 'journal' | 'conversation';
  content: string;
  embedding?: number[];
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export interface TaskItem {
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

export interface UsageData {
  date: string;
  tokens: number;
  cost: number;
  model: string;
  agentId: string;
}

export interface Channel {
  id: string;
  type: 'telegram' | 'discord' | 'whatsapp' | 'signal' | 'slack';
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  config: Record<string, unknown>;
  agentIds: string[];
}

export interface DiagnosticCheck {
  id: string;
  name: string;
  category: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details?: string;
  fixAvailable: boolean;
  fixCommand?: string;
}

export interface SystemResources {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
}

export interface GatewayHealth {
  status: 'healthy' | 'degraded' | 'offline';
  uptime: number;
  lastCheck: Date;
  responseTime: number;
  errors: string[];
}
