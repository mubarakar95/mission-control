'use client';

import React, { useState } from 'react';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import { MetricCard, StatusBadge, StatusDot, Tag } from '@/components/ui/design-system';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Zap, Activity, Calendar } from 'lucide-react';

// Mock data for charts
const tokenUsageData = [
  { date: 'Mon', tokens: 45000, cost: 4.5 },
  { date: 'Tue', tokens: 52000, cost: 5.2 },
  { date: 'Wed', tokens: 48000, cost: 4.8 },
  { date: 'Thu', tokens: 61000, cost: 6.1 },
  { date: 'Fri', tokens: 55000, cost: 5.5 },
  { date: 'Sat', tokens: 38000, cost: 3.8 },
  { date: 'Sun', tokens: 42000, cost: 4.2 },
];

const modelUsageData = [
  { model: 'GPT-4 Turbo', tokens: 125000, cost: 125, requests: 3420, percentage: 35 },
  { model: 'GPT-4o', tokens: 85000, cost: 85, requests: 2150, percentage: 24 },
  { model: 'Claude 3 Opus', tokens: 72000, cost: 108, requests: 1890, percentage: 20 },
  { model: 'Claude 3 Sonnet', tokens: 45000, cost: 45, requests: 1230, percentage: 13 },
  { model: 'Gemini Pro', tokens: 30000, cost: 30, requests: 890, percentage: 8 },
];

const agentCostData = [
  { agent: 'Primary Agent', cost: 156, requests: 4520 },
  { agent: 'Research Assistant', cost: 89, requests: 2180 },
  { agent: 'Code Generator', cost: 148, requests: 3290 },
];

// Chart colors from design system
const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function UsagePage() {
  const [timeRange, setTimeRange] = useState('7d');

  const totalCost = modelUsageData.reduce((acc, m) => acc + m.cost, 0);
  const totalTokens = modelUsageData.reduce((acc, m) => acc + m.tokens, 0);
  const totalRequests = modelUsageData.reduce((acc, m) => acc + m.requests, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Usage & Costs</h2>
          <p className="text-muted-foreground">Track token usage and cost analytics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 bg-muted border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Cost"
          value={`$${totalCost.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: 12.5, label: 'vs last period' }}
          status="success"
        />
        <MetricCard
          title="Total Tokens"
          value={`${(totalTokens / 1000).toFixed(0)}K`}
          icon={Zap}
          trend={{ value: -3.2, label: 'vs last period' }}
          status="warning"
        />
        <MetricCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          icon={Activity}
          trend={{ value: 8.7, label: 'vs last period' }}
          status="success"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CrashProofPanel title="Token Usage Over Time">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg">Token Usage Over Time</CardTitle>
              <CardDescription>Daily token consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={tokenUsageData}>
                  <defs>
                    <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px',
                      color: 'var(--foreground)'
                    }}
                    labelStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="tokens" stroke="var(--chart-1)" fillOpacity={1} fill="url(#colorTokens)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </CrashProofPanel>

        <CrashProofPanel title="Cost Over Time">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg">Cost Over Time</CardTitle>
              <CardDescription>Daily cost in USD</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={tokenUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px',
                      color: 'var(--foreground)'
                    }}
                    labelStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                  />
                  <Line type="monotone" dataKey="cost" stroke="var(--chart-2)" strokeWidth={2} dot={{ fill: 'var(--chart-2)' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </CrashProofPanel>
      </div>

      {/* Model Distribution & Agent Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CrashProofPanel title="Model Usage Distribution">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg">Model Usage Distribution</CardTitle>
              <CardDescription>Tokens by model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={modelUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="tokens"
                    >
                      {modelUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {modelUsageData.map((model, index) => (
                    <div key={model.model} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      />
                      <span className="text-sm text-muted-foreground">{model.model}</span>
                      <span className="text-sm text-foreground ml-auto">{model.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CrashProofPanel>

        <CrashProofPanel title="Cost by Agent">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg">Cost by Agent</CardTitle>
              <CardDescription>Spending per agent</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={agentCostData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" />
                  <YAxis type="category" dataKey="agent" stroke="var(--muted-foreground)" width={120} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px',
                      color: 'var(--foreground)'
                    }}
                    labelStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                  />
                  <Bar dataKey="cost" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </CrashProofPanel>
      </div>

      {/* Model Details Table */}
      <CrashProofPanel title="Model Details">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Model Usage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Model</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Tokens</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Requests</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Cost</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {modelUsageData.map((model) => (
                    <tr key={model.model} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm text-foreground">{model.model}</td>
                      <td className="py-3 px-4 text-sm text-right text-muted-foreground">{model.tokens.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right text-muted-foreground">{model.requests.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right text-foreground">${model.cost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Tag variant="primary" size="sm">{model.percentage}%</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </CrashProofPanel>
    </div>
  );
}

export default UsagePage;
