/**
 * OpenClaw Client
 * Unified client for OpenClaw CLI and Gateway operations
 */

import { getAutoTransport, AutoTransport } from './transports/auto-transport';
import type { TransportResponse, AgentInfo, TaskItem, CronJob, MemoryEntry, Channel, UsageData, SystemResources, GatewayHealth, DiagnosticCheck } from './transports/types';

export interface OpenClawClientConfig {
  transport?: 'auto' | 'http' | 'cli';
  timeout?: number;
}

export class OpenClawClient {
  private transport: AutoTransport;

  constructor(config: OpenClawClientConfig = {}) {
    this.transport = getAutoTransport({
      preferHttp: config.transport !== 'cli',
      fallbackToCli: config.transport !== 'http',
      httpTimeout: config.timeout,
      cliTimeout: config.timeout,
    });
  }

  // ========================================
  // Gateway Operations
  // ========================================

  async getGatewayStatus(): Promise<TransportResponse<GatewayHealth>> {
    return this.transport.get<GatewayHealth>('/api/gateway/status');
  }

  async startGateway(): Promise<TransportResponse> {
    return this.transport.post('/api/gateway/start', {});
  }

  async stopGateway(): Promise<TransportResponse> {
    return this.transport.post('/api/gateway/stop', {});
  }

  async restartGateway(): Promise<TransportResponse> {
    return this.transport.post('/api/gateway/restart', {});
  }

  // ========================================
  // Agent Operations
  // ========================================

  async getAgents(): Promise<TransportResponse<AgentInfo[]>> {
    return this.transport.get<AgentInfo[]>('/api/agents');
  }

  async getAgent(id: string): Promise<TransportResponse<AgentInfo>> {
    return this.transport.get<AgentInfo>(`/api/agents/${id}`);
  }

  async wakeAgent(id: string): Promise<TransportResponse> {
    return this.transport.post(`/api/agents/${id}/wake`, {});
  }

  async spawnSubagent(parentId: string, config: Partial<AgentInfo>): Promise<TransportResponse<AgentInfo>> {
    return this.transport.post<AgentInfo>(`/api/agents/${parentId}/spawn`, config);
  }

  async shutdownAgent(id: string): Promise<TransportResponse> {
    return this.transport.delete(`/api/agents/${id}`);
  }

  // ========================================
  // Task Operations
  // ========================================

  async getTasks(): Promise<TransportResponse<TaskItem[]>> {
    return this.transport.get<TaskItem[]>('/api/tasks');
  }

  async createTask(task: Partial<TaskItem>): Promise<TransportResponse<TaskItem>> {
    return this.transport.post<TaskItem>('/api/tasks', task);
  }

  async updateTask(id: string, updates: Partial<TaskItem>): Promise<TransportResponse<TaskItem>> {
    return this.transport.put<TaskItem>(`/api/tasks/${id}`, updates);
  }

  async deleteTask(id: string): Promise<TransportResponse> {
    return this.transport.delete(`/api/tasks/${id}`);
  }

  async moveTask(id: string, status: TaskItem['status']): Promise<TransportResponse<TaskItem>> {
    return this.transport.put<TaskItem>(`/api/tasks/${id}`, { status });
  }

  // ========================================
  // Cron Operations
  // ========================================

  async getCronJobs(): Promise<TransportResponse<CronJob[]>> {
    return this.transport.get<CronJob[]>('/api/cron');
  }

  async createCronJob(job: Partial<CronJob>): Promise<TransportResponse<CronJob>> {
    return this.transport.post<CronJob>('/api/cron', job);
  }

  async updateCronJob(id: string, updates: Partial<CronJob>): Promise<TransportResponse<CronJob>> {
    return this.transport.put<CronJob>(`/api/cron/${id}`, updates);
  }

  async pauseCronJob(id: string): Promise<TransportResponse> {
    return this.transport.post(`/api/cron/${id}/pause`, {});
  }

  async resumeCronJob(id: string): Promise<TransportResponse> {
    return this.transport.post(`/api/cron/${id}/resume`, {});
  }

  async testCronJob(id: string): Promise<TransportResponse> {
    return this.transport.post(`/api/cron/${id}/test`, {});
  }

  async deleteCronJob(id: string): Promise<TransportResponse> {
    return this.transport.delete(`/api/cron/${id}`);
  }

  // ========================================
  // Memory Operations
  // ========================================

  async getMemory(agentId?: string): Promise<TransportResponse<MemoryEntry[]>> {
    const endpoint = agentId ? `/api/memory?agentId=${agentId}` : '/api/memory';
    return this.transport.get<MemoryEntry[]>(endpoint);
  }

  async getMemoryEntry(id: string): Promise<TransportResponse<MemoryEntry>> {
    return this.transport.get<MemoryEntry>(`/api/memory/${id}`);
  }

  async createMemoryEntry(entry: Partial<MemoryEntry>): Promise<TransportResponse<MemoryEntry>> {
    return this.transport.post<MemoryEntry>('/api/memory', entry);
  }

  async updateMemoryEntry(id: string, updates: Partial<MemoryEntry>): Promise<TransportResponse<MemoryEntry>> {
    return this.transport.put<MemoryEntry>(`/api/memory/${id}`, updates);
  }

  async deleteMemoryEntry(id: string): Promise<TransportResponse> {
    return this.transport.delete(`/api/memory/${id}`);
  }

  async searchMemory(query: string, agentId?: string): Promise<TransportResponse<MemoryEntry[]>> {
    return this.transport.post<MemoryEntry[]>('/api/memory/search', { query, agentId });
  }

  // ========================================
  // Channel Operations
  // ========================================

  async getChannels(): Promise<TransportResponse<Channel[]>> {
    return this.transport.get<Channel[]>('/api/channels');
  }

  async connectChannel(id: string, config: Record<string, unknown>): Promise<TransportResponse> {
    return this.transport.post(`/api/channels/${id}/connect`, config);
  }

  async disconnectChannel(id: string): Promise<TransportResponse> {
    return this.transport.post(`/api/channels/${id}/disconnect`, {});
  }

  // ========================================
  // Usage Operations
  // ========================================

  async getUsage(period?: { start: Date; end: Date }): Promise<TransportResponse<UsageData[]>> {
    const params = period 
      ? `?start=${period.start.toISOString()}&end=${period.end.toISOString()}`
      : '';
    return this.transport.get<UsageData[]>(`/api/usage${params}`);
  }

  async getUsageByModel(): Promise<TransportResponse<Record<string, UsageData[]>>> {
    return this.transport.get<Record<string, UsageData[]>>('/api/usage/by-model');
  }

  async getUsageByAgent(): Promise<TransportResponse<Record<string, UsageData[]>>> {
    return this.transport.get<Record<string, UsageData[]>>('/api/usage/by-agent');
  }

  // ========================================
  // Diagnostics Operations
  // ========================================

  async runDiagnostics(): Promise<TransportResponse<DiagnosticCheck[]>> {
    return this.transport.get<DiagnosticCheck[]>('/api/doctor');
  }

  async applyFix(checkId: string): Promise<TransportResponse> {
    return this.transport.post(`/api/doctor/${checkId}/fix`, {});
  }

  // ========================================
  // System Operations
  // ========================================

  async getSystemResources(): Promise<TransportResponse<SystemResources>> {
    return this.transport.get<SystemResources>('/api/system/resources');
  }

  async getActivity(limit?: number): Promise<TransportResponse<unknown[]>> {
    const params = limit ? `?limit=${limit}` : '';
    return this.transport.get<unknown[]>(`/api/activity${params}`);
  }

  // ========================================
  // Config Operations
  // ========================================

  async getConfig(): Promise<TransportResponse<Record<string, unknown>>> {
    return this.transport.get<Record<string, unknown>>('/api/config');
  }

  async updateConfig(config: Record<string, unknown>): Promise<TransportResponse> {
    return this.transport.put('/api/config', config);
  }

  // ========================================
  // Chat Operations
  // ========================================

  async sendMessage(agentId: string, message: string, attachments?: string[]): Promise<TransportResponse> {
    return this.transport.post('/api/chat', { agentId, message, attachments });
  }

  async getChatHistory(agentId?: string, limit?: number): Promise<TransportResponse<unknown[]>> {
    const params = new URLSearchParams();
    if (agentId) params.set('agentId', agentId);
    if (limit) params.set('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.transport.get<unknown[]>(`/api/chat/history${query}`);
  }
}

// Singleton instance
let clientInstance: OpenClawClient | null = null;

export function getOpenClawClient(config?: OpenClawClientConfig): OpenClawClient {
  if (!clientInstance || config) {
    clientInstance = new OpenClawClient(config);
  }
  return clientInstance;
}

// Convenience functions
export const openclaw = {
  client: () => getOpenClawClient(),
  
  // Shorthand methods
  getAgents: () => getOpenClawClient().getAgents(),
  getTasks: () => getOpenClawClient().getTasks(),
  getCronJobs: () => getOpenClawClient().getCronJobs(),
  getMemory: (agentId?: string) => getOpenClawClient().getMemory(agentId),
  getChannels: () => getOpenClawClient().getChannels(),
  getUsage: (period?: { start: Date; end: Date }) => getOpenClawClient().getUsage(period),
  runDiagnostics: () => getOpenClawClient().runDiagnostics(),
  getGatewayStatus: () => getOpenClawClient().getGatewayStatus(),
  getSystemResources: () => getOpenClawClient().getSystemResources(),
};

export const openclawClient = {
  getOpenClawClient,
  OpenClawClient,
  openclaw,
};
