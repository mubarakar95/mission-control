'use client';

import React, { useEffect } from 'react';
import { NavigationSidebar } from '@/components/dashboard/sidebar';
import { ErrorBoundary } from '@/components/dashboard/error-boundary';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { SearchPalette } from '@/components/dashboard/search-palette';
import { Toaster } from '@/components/ui/sonner';
import { StatusDot } from '@/components/ui/design-system';
import { cn } from '@/lib/utils';

// Page imports
import { DashboardPage } from '@/components/dashboard/pages/dashboard';
import { ChatPage } from '@/components/dashboard/pages/chat';
import { TasksPage } from '@/components/dashboard/pages/tasks';
import { CronPage } from '@/components/dashboard/pages/cron';
import { UsagePage } from '@/components/dashboard/pages/usage';
import { OrgChartPage } from '@/components/dashboard/pages/org-chart';
import { MemoryPage } from '@/components/dashboard/pages/memory';
import { ModelsPage } from '@/components/dashboard/pages/models';
import { DiagnosticsPage } from '@/components/dashboard/pages/diagnostics';
import { TerminalPage } from '@/components/dashboard/pages/terminal';
import { ChannelsPage } from '@/components/dashboard/pages/channels';
import { ExplorerPage } from '@/components/dashboard/pages/explorer';
import { SecurityPage } from '@/components/dashboard/pages/security';

const pageComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  chat: ChatPage,
  tasks: TasksPage,
  cron: CronPage,
  usage: UsagePage,
  'org-chart': OrgChartPage,
  memory: MemoryPage,
  models: ModelsPage,
  diagnostics: DiagnosticsPage,
  terminal: TerminalPage,
  channels: ChannelsPage,
  explorer: ExplorerPage,
  security: SecurityPage,
};

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard & Monitoring',
  chat: 'Multi-Agent Chat',
  tasks: 'Task Management',
  cron: 'Cron & Scheduling',
  usage: 'Usage & Costs',
  'org-chart': 'Agent Org Chart',
  memory: 'Memory & Vector Search',
  models: 'Models & Keys',
  diagnostics: 'Diagnostics',
  terminal: 'Terminal',
  channels: 'Channels',
  explorer: 'Document Explorer',
  security: 'Security & Access',
};

export function MissionControlLayout() {
  const { currentPage, systemResources, setSystemResources, agents } = useMissionControlStore();

  // Simulate real-time resource updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemResources({
        cpu: Math.min(100, Math.max(0, systemResources.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(0, systemResources.memory + (Math.random() - 0.5) * 5)),
        disk: systemResources.disk,
        network: {
          in: Math.max(0, systemResources.network.in + (Math.random() - 0.5) * 20000),
          out: Math.max(0, systemResources.network.out + (Math.random() - 0.5) * 15000),
        },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [systemResources, setSystemResources]);

  const PageComponent = pageComponents[currentPage] || DashboardPage;
  const activeAgents = agents.filter(a => a.status === 'active').length;

  return (
    <div className="flex h-screen bg-background dark">
      <NavigationSidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">
              {pageTitles[currentPage] || 'Mission Control'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">CPU:</span>
                <span className={cn(
                  'font-mono',
                  systemResources.cpu > 80 ? 'text-[var(--destructive)]' : 
                  systemResources.cpu > 60 ? 'text-[var(--warning)]' : 'text-[var(--success)]'
                )}>
                  {systemResources.cpu.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Mem:</span>
                <span className={cn(
                  'font-mono',
                  systemResources.memory > 80 ? 'text-[var(--destructive)]' : 
                  systemResources.memory > 60 ? 'text-[var(--warning)]' : 'text-[var(--success)]'
                )}>
                  {systemResources.memory.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status="active" size="sm" pulse />
                <span className="text-muted-foreground">{activeAgents} active</span>
              </div>
            </div>
            
            {/* Search Trigger */}
            <button
              onClick={() => useMissionControlStore.getState().setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <span className="text-sm">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded bg-muted-foreground/10 text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 bg-background">
          <ErrorBoundary fallbackTitle="Page Error">
            <PageComponent />
          </ErrorBoundary>
        </div>
      </main>

      {/* Global Search Palette */}
      <SearchPalette />

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default MissionControlLayout;
