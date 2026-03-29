'use client';

import React from 'react';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  StatusBadge,
  StatusDot,
  MetricCard,
  ProgressCard,
  ActivityList,
  ActivityItem,
} from '@/components/ui/design-system';
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
} from 'lucide-react';

export function DashboardPage() {
  const { agents, cronJobs, systemResources, gatewayHealth } = useMissionControlStore();

  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const runningCrons = cronJobs.filter((c) => c.status === 'running').length;

  const activities: ActivityItem[] = [
    { id: '1', title: 'Primary Agent completed task "Generate Report"', timestamp: '2m ago', type: 'success' },
    { id: '2', title: 'Code Generator deployed to production', timestamp: '5m ago', type: 'info' },
    { id: '3', title: 'Memory cleanup completed - 1.2GB freed', timestamp: '12m ago', type: 'success' },
    { id: '4', title: 'New Telegram message received', timestamp: '25m ago', type: 'info' },
    { id: '5', title: 'Cron job "Daily Backup" started', timestamp: '1h ago', type: 'info' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CrashProofPanel title="Gateway Health">
          <MetricCard
            title="Gateway Health"
            value={`${gatewayHealth.uptime.toFixed(2)}%`}
            description={`Response: ${gatewayHealth.responseTime}ms`}
            icon={CheckCircle2}
            status={gatewayHealth.status === 'healthy' ? 'success' : gatewayHealth.status === 'degraded' ? 'warning' : 'error'}
          />
        </CrashProofPanel>

        <CrashProofPanel title="Active Agents">
          <MetricCard
            title="Active Agents"
            value={`${activeAgents}/${agents.length}`}
            description={`${agents.filter((a) => a.status === 'idle').length} idle`}
            icon={Users}
            status="neutral"
          />
        </CrashProofPanel>

        <CrashProofPanel title="Running Cron Jobs">
          <MetricCard
            title="Running Cron Jobs"
            value={`${runningCrons}/${cronJobs.length}`}
            description={`${cronJobs.filter((c) => c.status === 'paused').length} paused`}
            icon={Clock}
            status="neutral"
          />
        </CrashProofPanel>

        <CrashProofPanel title="Requests/min">
          <MetricCard
            title="Requests/min"
            value={Math.floor(Math.random() * 100) + 50}
            trend={{ value: 12, label: 'vs last hour' }}
            icon={Activity}
            status="success"
          />
        </CrashProofPanel>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CrashProofPanel title="CPU Usage">
          <ProgressCard title="CPU Usage" value={systemResources.cpu} unit="%" showValue />
        </CrashProofPanel>

        <CrashProofPanel title="Memory Usage">
          <ProgressCard title="Memory Usage" value={systemResources.memory} unit="%" showValue />
        </CrashProofPanel>

        <CrashProofPanel title="Disk Usage">
          <ProgressCard title="Disk Usage" value={systemResources.disk} unit="%" status="neutral" showValue />
        </CrashProofPanel>
      </div>

      {/* Network & Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CrashProofPanel title="Network I/O">
          <Card className="bg-card border-border h-full">
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
                    <div className="text-xs text-muted-foreground/70">Outbound traffic</div>
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
                    <div className="text-xs text-muted-foreground/70">Inbound traffic</div>
                  </div>
                </div>
                <span className="font-mono text-foreground">
                  {(systemResources.network.in / 1024).toFixed(1)} KB/s
                </span>
              </div>
            </CardContent>
          </Card>
        </CrashProofPanel>

        <CrashProofPanel title="Agent Status">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Agent Status
              </CardTitle>
              <CardDescription>Current agent activity overview</CardDescription>
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
        </CrashProofPanel>
      </div>

      {/* Recent Activity */}
      <CrashProofPanel title="Recent Activity">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest system events and agent actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityList items={activities} />
          </CardContent>
        </Card>
      </CrashProofPanel>
    </div>
  );
}

export default DashboardPage;
