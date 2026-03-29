'use client';

import React, { useState } from 'react';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  Users,
  Bot,
  Zap,
  Power,
  PowerOff,
  Settings,
  Radio,
  ChevronDown,
  ChevronRight,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Agent } from '@/lib/types';

interface AgentNodeProps {
  agent: Agent;
  subAgents?: Agent[];
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: Agent['status']) => void;
}

function AgentNode({ agent, subAgents = [], isExpanded, onToggle, onStatusChange }: AgentNodeProps) {
  const statusColors: Record<Agent['status'], string> = {
    active: 'bg-emerald-500',
    idle: 'bg-amber-500',
    offline: 'bg-zinc-500',
    error: 'bg-red-500',
  };

  const hasSubAgents = subAgents.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
        {hasSubAgents && (
          <button onClick={onToggle} className="text-zinc-400 hover:text-white">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {!hasSubAgents && <div className="w-4" />}

        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarFallback className={
              agent.type === 'primary'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-blue-500/20 text-blue-400'
            }>
              <Bot className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-800 ${statusColors[agent.status]}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white">{agent.name}</h3>
            <Badge variant="outline" className={`text-xs ${
              agent.type === 'primary' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
            }`}>
              {agent.type}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
            <span>{agent.model}</span>
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {agent.memoryUsage} MB
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {agent.tasksCompleted} tasks
            </span>
          </div>
        </div>

        {/* Channels */}
        <div className="flex items-center gap-1">
          {agent.channels.map((channel) => (
            <div key={channel} className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
              <Radio className="w-3 h-3 text-zinc-400" />
            </div>
          ))}
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2">
          <Switch
            checked={agent.status === 'active' || agent.status === 'idle'}
            onCheckedChange={(checked) => onStatusChange(checked ? 'active' : 'offline')}
          />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sub-agents */}
      {hasSubAgents && isExpanded && (
        <div className="ml-8 mt-2 pl-4 border-l-2 border-zinc-700 space-y-2">
          {subAgents.map((child) => (
            <AgentNode
              key={child.id}
              agent={child}
              isExpanded={false}
              onToggle={() => {}}
              onStatusChange={(status) => console.log('Change status:', child.id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrgChartPage() {
  const { agents, updateAgentStatus } = useMissionControlStore();
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set(['agent-1']));

  const primaryAgents = agents.filter((a) => a.type === 'primary');
  const getSubagents = (parentId: string) => agents.filter((a) => a.parentAgentId === parentId);

  const toggleExpand = (agentId: string) => {
    setExpandedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) {
        next.delete(agentId);
      } else {
        next.add(agentId);
      }
      return next;
    });
  };

  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const totalMemory = agents.reduce((acc, a) => acc + a.memoryUsage, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Agent Org Chart</h2>
          <p className="text-zinc-500">Manage agent hierarchy and status</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Zap className="w-4 h-4 mr-2" />
          Deploy New Agent
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{agents.length}</p>
                <p className="text-xs text-zinc-500">Total Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{activeAgents}</p>
                <p className="text-xs text-zinc-500">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalMemory} MB</p>
                <p className="text-xs text-zinc-500">Total Memory</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {agents.reduce((acc, a) => acc + a.tasksCompleted, 0).toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Chart */}
      <CrashProofPanel title="Agent Hierarchy">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Agent Hierarchy</CardTitle>
            <CardDescription>
              Click to expand/collapse subagents. Toggle switches to spin up or shut down agents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {primaryAgents.map((agent) => (
                <AgentNode
                  key={agent.id}
                  agent={agent}
                  subAgents={getSubagents(agent.id)}
                  isExpanded={expandedAgents.has(agent.id)}
                  onToggle={() => toggleExpand(agent.id)}
                  onStatusChange={(status) => updateAgentStatus(agent.id, status)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </CrashProofPanel>

      {/* Agent Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CrashProofPanel title="Connected Channels">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Connected Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agents.map((agent) => (
                  agent.channels.length > 0 && (
                    <div key={agent.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-zinc-700">
                            <Bot className="w-4 h-4 text-zinc-400" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-white">{agent.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {agent.channels.map((ch) => (
                          <Badge key={ch} variant="outline" className="bg-zinc-700 text-xs">
                            {ch}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </CrashProofPanel>

        <CrashProofPanel title="Recent Activity">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { agent: 'Primary Agent', action: 'Completed task', time: '2m ago' },
                  { agent: 'Code Generator', action: 'Deployed to production', time: '15m ago' },
                  { agent: 'Research Assistant', action: 'Generated report', time: '1h ago' },
                  { agent: 'Primary Agent', action: 'Processed 12 messages', time: '2h ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded">
                    <div>
                      <span className="text-sm text-white">{activity.agent}</span>
                      <span className="text-sm text-zinc-500"> - {activity.action}</span>
                    </div>
                    <span className="text-xs text-zinc-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CrashProofPanel>
      </div>
    </div>
  );
}

export default OrgChartPage;
