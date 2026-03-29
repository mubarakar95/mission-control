'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionHeader, MetricCard, ProgressCard, ActivityList, StatusBadge, StatusDot } from '@/components/ui/design-system';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { useGatewayStatusStore } from '@/lib/gateway/gateway-status-store';
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Users,
  Clock,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import type { ActivityItem } from '@/components/ui/design-system';

export default function DashboardView() {
  const { agents, cronJobs, systemResources, setSystemResources } = useMissionControlStore();
  const { status: gatewayStatus } = useGatewayStatusStore();

  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const runningCrons = cronJobs.filter((c) => c.status === 'running').length;

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

  const activities: ActivityItem[] = [
    { id: '1', title: 'Primary Agent completed task "Generate Report"', timestamp: '2m ago', type: 'success' },
    { id: '2', title: 'Code Generator deployed to production', timestamp: '5m ago', type: 'info' },
    { id: '3', title: 'Memory cleanup completed - 1.2GB freed', timestamp: '12m ago', type: 'success' },
    { id: '4', title: 'New Telegram message received', timestamp: '25m ago', type: 'info' },
    { id: '5', title: 'Cron job "Daily Backup" started', timestamp: '1h ago', type: 'info' },
    { id: '6', title: 'Rate limit warning for OpenAI API', timestamp: '2h ago', type: 'warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <SectionHeader
        title="Dashboard"
        description="Live overview of your OpenClaw environment"
        action={
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gateway Health */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gateway</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {gatewayStatus.online ? 'Online' : 'Offline'}
                </p>
                {gatewayStatus.version && (
                  <p className="text-xs text-muted-foreground mt-1">v{gatewayStatus.version}</p>
                )}
              </div>
              <div className="p-2.5 rounded-xl bg-muted/50">
                <StatusDot
                  status={gatewayStatus.online ? 'active' : 'error'}
                  pulse={gatewayStatus.online}
                  size="lg"
                />
              </div>
            </div>
            {gatewayStatus.responseTime && (
              <p className="text-xs text-muted-foreground mt-3">
                Response: {gatewayStatus.responseTime}ms
              </p>
            )}
          </CardContent>
        </Card>

        {/* Active Agents */}
        <MetricCard
          title="Active Agents"
          value={`${activeAgents}/${agents.length}`}
          description={`${agents.filter((a) => a.status === 'idle').length} idle`}
          icon={Users}
          status={activeAgents > 0 ? 'success' : 'warning'}
        />

        {/* Running Crons */}
        <MetricCard
          title="Running Jobs"
          value={`${runningCrons}/${cronJobs.length}`}
          description={`${cronJobs.filter((c) => c.status === 'paused').length} paused`}
          icon={Clock}
          status="neutral"
        />

        {/* Requests */}
        <MetricCard
          title="Requests/min"
          value={Math.floor(Math.random() * 100) + 50}
          trend={{ value: 12, label: 'vs last hour' }}
          icon={Activity}
          status="success"
        />
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ProgressCard title="CPU Usage" value={systemResources.cpu} unit="%" />
        <ProgressCard title="Memory Usage" value={systemResources.memory} unit="%" />
        <ProgressCard title="Disk Usage" value={systemResources.disk} unit="%" status="neutral" />
      </div>

      {/* Network & Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Network I/O */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              Network I/O
            </CardTitle>
            <CardDescription>Real-time network throughput</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--success)]/15 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-[var(--success)]" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Upload</div>
                  <div className="text-xs text-muted-foreground/70">Outbound</div>
                </div>
              </div>
              <span className="font-mono text-foreground">
                {(systemResources.network.out / 1024).toFixed(1)} KB/s
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--info)]/15 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4 text-[var(--info)]" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Download</div>
                  <div className="text-xs text-muted-foreground/70">Inbound</div>
                </div>
              </div>
              <span className="font-mono text-foreground">
                {(systemResources.network.in / 1024).toFixed(1)} KB/s
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Agent Status
            </CardTitle>
            <CardDescription>Current agent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <StatusDot
                      status={agent.status as 'active' | 'inactive' | 'pending' | 'error'}
                      pulse={agent.status === 'active'}
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">{agent.model}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{agent.tasksCompleted} tasks</div>
                    </div>
                    <StatusBadge
                      status={agent.status as 'active' | 'inactive' | 'pending' | 'error'}
                      size="sm"
                    >
                      {agent.status}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Latest system events and agent actions</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityList items={activities} />
        </CardContent>
      </Card>
    </div>
  );
}
