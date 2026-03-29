'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Wrench,
  Server,
  Database,
  Wifi,
  Shield,
  Key,
  Globe,
  Clock,
} from 'lucide-react';

interface DiagnosticCheck {
  id: string;
  name: string;
  category: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details?: string;
  fixAvailable: boolean;
  fixCommand?: string;
}

const diagnosticChecks: DiagnosticCheck[] = [
  { id: '1', name: 'Gateway Connectivity', category: 'Network', status: 'pass', message: 'Gateway is responding normally', details: 'Response time: 42ms', fixAvailable: false },
  { id: '2', name: 'Database Connection', category: 'Database', status: 'pass', message: 'Database connection pool healthy', details: '5/10 connections active', fixAvailable: false },
  { id: '3', name: 'API Key Validation', category: 'Security', status: 'warn', message: 'Some API keys are expired or missing', details: 'Gemini Pro key needs refresh', fixAvailable: true, fixCommand: 'Refresh API key' },
  { id: '4', name: 'Memory Usage', category: 'System', status: 'pass', message: 'Memory usage within limits', details: '62% used (9.9GB / 16GB)', fixAvailable: false },
  { id: '5', name: 'Disk Space', category: 'System', status: 'pass', message: 'Sufficient disk space available', details: '38% used (194GB / 512GB)', fixAvailable: false },
  { id: '6', name: 'Agent Health', category: 'Agents', status: 'pass', message: 'All agents are operational', details: '2 active, 1 idle', fixAvailable: false },
  { id: '7', name: 'Vector Database', category: 'Database', status: 'pass', message: 'Vector store is accessible', details: '1.2M vectors indexed', fixAvailable: false },
  { id: '8', name: 'SSL Certificates', category: 'Security', status: 'pass', message: 'SSL certificates are valid', details: 'Expires in 89 days', fixAvailable: false },
  { id: '9', name: 'Cron Jobs', category: 'System', status: 'warn', message: 'Some cron jobs are paused', details: '1 of 3 jobs paused', fixAvailable: true, fixCommand: 'Resume paused jobs' },
  { id: '10', name: 'Channel Connections', category: 'Network', status: 'fail', message: 'Discord channel disconnected', details: 'Authentication failed', fixAvailable: true, fixCommand: 'Reconnect Discord' },
];

export function DiagnosticsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [checks, setChecks] = useState(diagnosticChecks);

  const runDiagnostics = async () => {
    setIsRunning(true);
    // Simulate running diagnostics
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRunning(false);
  };

  const applyFix = (checkId: string) => {
    setChecks((prev) =>
      prev.map((c) =>
        c.id === checkId ? { ...c, status: 'pass', message: 'Issue resolved', fixAvailable: false } : c
      )
    );
  };

  const statusCounts = {
    pass: checks.filter((c) => c.status === 'pass').length,
    warn: checks.filter((c) => c.status === 'warn').length,
    fail: checks.filter((c) => c.status === 'fail').length,
  };

  const healthScore = Math.round((statusCounts.pass / checks.length) * 100);

  const categoryIcons: Record<string, React.ElementType> = {
    Network: Wifi,
    Database: Database,
    Security: Shield,
    System: Server,
    Agents: Key,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Diagnostics</h2>
          <p className="text-zinc-500">System health checks and one-click fixes</p>
        </div>
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Stethoscope className="w-4 h-4 mr-2" />
              Run Diagnostics
            </>
          )}
        </Button>
      </div>

      {/* Health Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#27272a"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${healthScore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{healthScore}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">System Health</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {statusCounts.pass} checks passing, {statusCounts.warn} warnings, {statusCounts.fail} failures
                </p>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-zinc-400">{statusCounts.pass} Pass</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-zinc-400">{statusCounts.warn} Warn</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-zinc-400">{statusCounts.fail} Fail</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Last Check</p>
                <p className="text-lg font-medium text-white">2 min ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Fixes Available</p>
                <p className="text-lg font-medium text-white">{checks.filter((c) => c.fixAvailable).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checks List */}
      <CrashProofPanel title="Diagnostic Checks">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">All Checks</CardTitle>
            <CardDescription>Detailed results for each diagnostic check</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {checks.map((check) => {
                  const CategoryIcon = categoryIcons[check.category] || Server;
                  return (
                    <div
                      key={check.id}
                      className={`p-4 rounded-lg border ${
                        check.status === 'pass'
                          ? 'bg-zinc-800/50 border-zinc-700'
                          : check.status === 'warn'
                          ? 'bg-amber-500/5 border-amber-500/20'
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${
                            check.status === 'pass' ? 'text-emerald-500' :
                            check.status === 'warn' ? 'text-amber-500' :
                            'text-red-500'
                          }`}>
                            {check.status === 'pass' ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : check.status === 'warn' ? (
                              <AlertTriangle className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white">{check.name}</h4>
                              <Badge variant="outline" className="text-xs bg-zinc-700">
                                <CategoryIcon className="w-3 h-3 mr-1" />
                                {check.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-400 mt-1">{check.message}</p>
                            {check.details && (
                              <p className="text-xs text-zinc-500 mt-1">{check.details}</p>
                            )}
                          </div>
                        </div>
                        {check.fixAvailable && (
                          <Button
                            size="sm"
                            onClick={() => applyFix(check.id)}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            <Wrench className="w-3 h-3 mr-1" />
                            Fix
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </CrashProofPanel>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
          <RefreshCw className="w-5 h-5 text-zinc-400" />
          <span className="text-sm text-white">Restart Gateway</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
          <Database className="w-5 h-5 text-zinc-400" />
          <span className="text-sm text-white">Clear Cache</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
          <Globe className="w-5 h-5 text-zinc-400" />
          <span className="text-sm text-white">Test Connectivity</span>
        </Button>
      </div>
    </div>
  );
}

export default DiagnosticsPage;
