import { create } from 'zustand';
import { Agent, Task, CronJob, ChatMessage, SystemResources, GatewayHealth, Channel, UsageData } from '@/lib/types';

interface MissionControlState {
  // UI State
  sidebarOpen: boolean;
  currentPage: string;
  searchOpen: boolean;
  searchTerm: string;

  // Dashboard State
  systemResources: SystemResources;
  gatewayHealth: GatewayHealth;

  // Agent State
  agents: Agent[];
  selectedAgentId: string | null;

  // Task State
  tasks: Task[];
  
  // Cron State
  cronJobs: CronJob[];
  
  // Chat State
  chatMessages: ChatMessage[];
  isStreaming: boolean;
  
  // Usage State
  usageData: UsageData[];
  
  // Channel State
  channels: Channel[];

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  
  setSystemResources: (resources: SystemResources) => void;
  setGatewayHealth: (health: GatewayHealth) => void;
  
  setAgents: (agents: Agent[]) => void;
  selectAgent: (agentId: string | null) => void;
  updateAgentStatus: (agentId: string, status: Agent['status']) => void;
  
  setTasks: (tasks: Task[]) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  
  setCronJobs: (jobs: CronJob[]) => void;
  updateCronStatus: (jobId: string, status: CronJob['status']) => void;
  
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;
  setStreaming: (streaming: boolean) => void;
  
  setUsageData: (data: UsageData[]) => void;
  
  setChannels: (channels: Channel[]) => void;
  updateChannelStatus: (channelId: string, status: Channel['status']) => void;
}

export const useMissionControlStore = create<MissionControlState>((set) => ({
  // Initial UI State
  sidebarOpen: true,
  currentPage: 'dashboard',
  searchOpen: false,
  searchTerm: '',

  // Initial Dashboard State
  systemResources: {
    cpu: 45,
    memory: 62,
    disk: 38,
    network: { in: 125000, out: 89000 },
  },
  gatewayHealth: {
    status: 'healthy',
    uptime: 99.97,
    lastCheck: new Date(),
    responseTime: 42,
    errors: [],
  },

  // Initial Agent State
  agents: [
    {
      id: 'agent-1',
      name: 'Primary Agent',
      type: 'primary',
      status: 'active',
      model: 'gpt-4-turbo',
      channels: ['telegram', 'slack'],
      createdAt: new Date('2024-01-15'),
      lastActive: new Date(),
      memoryUsage: 256,
      tasksCompleted: 1247,
    },
    {
      id: 'agent-2',
      name: 'Research Assistant',
      type: 'subagent',
      status: 'idle',
      model: 'gpt-4-turbo',
      parentAgentId: 'agent-1',
      channels: [],
      createdAt: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 3600000),
      memoryUsage: 128,
      tasksCompleted: 432,
    },
    {
      id: 'agent-3',
      name: 'Code Generator',
      type: 'subagent',
      status: 'active',
      model: 'claude-3-opus',
      parentAgentId: 'agent-1',
      channels: ['discord'],
      createdAt: new Date('2024-02-15'),
      lastActive: new Date(),
      memoryUsage: 192,
      tasksCompleted: 891,
    },
  ],
  selectedAgentId: null,

  // Initial Task State
  tasks: [
    {
      id: 'task-1',
      title: 'Implement vector search',
      description: 'Add semantic search capability to memory system',
      status: 'in_progress',
      priority: 'high',
      assigneeId: 'agent-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['feature', 'ai'],
    },
    {
      id: 'task-2',
      title: 'Fix cron job scheduler',
      description: 'Resolve timing issues with recurring tasks',
      status: 'review',
      priority: 'critical',
      assigneeId: 'agent-3',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(),
      tags: ['bug', 'cron'],
    },
    {
      id: 'task-3',
      title: 'Add Discord integration',
      description: 'Connect agent to Discord server',
      status: 'backlog',
      priority: 'medium',
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
      tags: ['feature', 'integration'],
    },
    {
      id: 'task-4',
      title: 'Optimize memory usage',
      description: 'Reduce memory footprint by 20%',
      status: 'done',
      priority: 'medium',
      assigneeId: 'agent-2',
      createdAt: new Date(Date.now() - 259200000),
      updatedAt: new Date(),
      tags: ['optimization'],
    },
    {
      id: 'task-5',
      title: 'Update API documentation',
      description: 'Document all new endpoints',
      status: 'backlog',
      priority: 'low',
      createdAt: new Date(Date.now() - 345600000),
      updatedAt: new Date(Date.now() - 345600000),
      tags: ['documentation'],
    },
  ],

  // Initial Cron State
  cronJobs: [
    {
      id: 'cron-1',
      name: 'Daily Report Generation',
      schedule: '0 8 * * *',
      command: 'generate-report --type daily',
      status: 'running',
      lastRun: new Date(Date.now() - 3600000),
      nextRun: new Date(Date.now() + 82800000),
      runHistory: [],
    },
    {
      id: 'cron-2',
      name: 'Memory Cleanup',
      schedule: '0 0 * * 0',
      command: 'cleanup-memory --max-age 30d',
      status: 'running',
      lastRun: new Date(Date.now() - 172800000),
      nextRun: new Date(Date.now() + 432000000),
      runHistory: [],
    },
    {
      id: 'cron-3',
      name: 'Backup Database',
      schedule: '0 2 * * *',
      command: 'backup-db --compress',
      status: 'paused',
      lastRun: new Date(Date.now() - 86400000),
      runHistory: [],
    },
  ],

  // Initial Chat State
  chatMessages: [],
  isStreaming: false,

  // Initial Usage State
  usageData: [],

  // Initial Channel State
  channels: [
    {
      id: 'ch-1',
      type: 'telegram',
      name: 'Main Bot',
      status: 'connected',
      config: {},
      agentIds: ['agent-1'],
    },
    {
      id: 'ch-2',
      type: 'slack',
      name: 'Workspace Slack',
      status: 'connected',
      config: {},
      agentIds: ['agent-1', 'agent-3'],
    },
    {
      id: 'ch-3',
      type: 'discord',
      name: 'Community Server',
      status: 'disconnected',
      config: {},
      agentIds: ['agent-3'],
    },
  ],

  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setSearchTerm: (term) => set({ searchTerm: term }),

  setSystemResources: (resources) => set({ systemResources: resources }),
  setGatewayHealth: (health) => set({ gatewayHealth: health }),

  setAgents: (agents) => set({ agents }),
  selectAgent: (agentId) => set({ selectedAgentId: agentId }),
  updateAgentStatus: (agentId, status) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === agentId ? { ...a, status } : a
      ),
    })),

  setTasks: (tasks) => set({ tasks }),
  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date() } : t
      ),
    })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),

  setCronJobs: (jobs) => set({ cronJobs: jobs }),
  updateCronStatus: (jobId, status) =>
    set((state) => ({
      cronJobs: state.cronJobs.map((j) =>
        j.id === jobId ? { ...j, status } : j
      ),
    })),

  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChatMessages: () => set({ chatMessages: [] }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),

  setUsageData: (data) => set({ usageData: data }),

  setChannels: (channels) => set({ channels }),
  updateChannelStatus: (channelId, status) =>
    set((state) => ({
      channels: state.channels.map((c) =>
        c.id === channelId ? { ...c, status } : c
      ),
    })),
}));
