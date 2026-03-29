'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  Key,
  FileWarning,
  Settings,
  RefreshCw,
  Wrench,
  FileText,
  Activity,
  UserX,
  Server,
  Trash2,
} from 'lucide-react';

interface SecurityAudit {
  id: string;
  type: 'credential_exposure' | 'permission_issue' | 'vulnerability' | 'misconfiguration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  status: 'open' | 'fixed' | 'ignored';
  detectedAt: Date;
  file?: string;
}

const securityAudits: SecurityAudit[] = [
  {
    id: '1',
    type: 'credential_exposure',
    severity: 'critical',
    title: 'API Key Exposed in Logs',
    description: 'An OpenAI API key was found in the application logs at /var/log/openclaw/app.log',
    recommendation: 'Rotate the exposed API key immediately and update log filtering rules.',
    status: 'open',
    detectedAt: new Date(Date.now() - 3600000),
    file: '/var/log/openclaw/app.log',
  },
  {
    id: '2',
    type: 'permission_issue',
    severity: 'high',
    title: 'Overly Permissive File Access',
    description: 'Agent "Primary Agent" has write access to system configuration files.',
    recommendation: 'Restrict agent file system access to workspace directory only.',
    status: 'open',
    detectedAt: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    type: 'misconfiguration',
    severity: 'medium',
    title: 'Debug Mode Enabled',
    description: 'Debug mode is currently enabled in production environment.',
    recommendation: 'Disable debug mode in production for better security.',
    status: 'fixed',
    detectedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '4',
    type: 'vulnerability',
    severity: 'medium',
    title: 'Outdated Dependency',
    description: 'Package "lodash" has a known vulnerability (CVE-2024-12345)',
    recommendation: 'Update lodash to version 4.17.21 or later.',
    status: 'open',
    detectedAt: new Date(Date.now() - 172800000),
  },
  {
    id: '5',
    type: 'credential_exposure',
    severity: 'low',
    title: 'Weak Password Policy',
    description: 'Channel authentication uses weak password requirements.',
    recommendation: 'Implement stronger password policy for channel authentication.',
    status: 'ignored',
    detectedAt: new Date(Date.now() - 259200000),
  },
];

const executionPermissions = [
  { id: '1', name: 'File System Write', description: 'Allow agents to write files', enabled: true, scope: 'workspace' },
  { id: '2', name: 'Network Access', description: 'Allow agents to make network requests', enabled: true, scope: 'all' },
  { id: '3', name: 'Code Execution', description: 'Allow agents to execute code', enabled: false, scope: 'none' },
  { id: '4', name: 'Shell Commands', description: 'Allow agents to run shell commands', enabled: true, scope: 'limited' },
  { id: '5', name: 'External APIs', description: 'Allow agents to call external APIs', enabled: true, scope: 'whitelist' },
];

const credentialStore = [
  { id: '1', name: 'OpenAI API Key', type: 'api_key', created: new Date('2024-01-15'), lastUsed: new Date(), masked: 'sk-...abc123' },
  { id: '2', name: 'Anthropic API Key', type: 'api_key', created: new Date('2024-02-01'), lastUsed: new Date(Date.now() - 3600000), masked: 'sk-ant-...xyz' },
  { id: '3', name: 'Telegram Bot Token', type: 'token', created: new Date('2024-01-20'), lastUsed: new Date(Date.now() - 86400000), masked: '123456:ABC...' },
  { id: '4', name: 'Database Password', type: 'password', created: new Date('2024-01-10'), lastUsed: new Date(Date.now() - 7200000), masked: '••••••••' },
];

export function SecurityPage() {
  const [audits, setAudits] = useState(securityAudits);
  const [isScanning, setIsScanning] = useState(false);

  const runScan = async () => {
    setIsScanning(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsScanning(false);
  };

  const fixAudit = (id: string) => {
    setAudits((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'fixed' } : a))
    );
  };

  const ignoreAudit = (id: string) => {
    setAudits((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'ignored' } : a))
    );
  };

  const severityColors: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-blue-500/20 text-blue-400',
  };

  const statusColors: Record<string, string> = {
    open: 'bg-red-500/20 text-red-400',
    fixed: 'bg-emerald-500/20 text-emerald-400',
    ignored: 'bg-zinc-500/20 text-zinc-400',
  };

  const typeIcons: Record<string, React.ElementType> = {
    credential_exposure: Key,
    permission_issue: Lock,
    vulnerability: FileWarning,
    misconfiguration: Settings,
  };

  const openIssues = audits.filter((a) => a.status === 'open');
  const criticalIssues = audits.filter((a) => a.status === 'open' && a.severity === 'critical');
  const securityScore = Math.round(100 - (openIssues.length * 10) - (criticalIssues.length * 20));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Security & Access</h2>
          <p className="text-zinc-500">Security audits, permissions, and credential management</p>
        </div>
        <Button
          onClick={runScan}
          disabled={isScanning}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Run Security Scan
            </>
          )}
        </Button>
      </div>

      {/* Security Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#27272a" strokeWidth="8" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={securityScore >= 80 ? '#10b981' : securityScore >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${securityScore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{securityScore}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Security Score</h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {openIssues.length} open issues, {criticalIssues.length} critical
                </p>
                <Progress value={securityScore} className="w-32 h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{audits.filter((a) => a.status === 'open').length}</p>
                <p className="text-xs text-zinc-500">Open Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{audits.filter((a) => a.status === 'fixed').length}</p>
                <p className="text-xs text-zinc-500">Fixed Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audits">
        <TabsList className="bg-zinc-800 border border-zinc-700">
          <TabsTrigger value="audits" className="data-[state=active]:bg-zinc-700">
            <Shield className="w-4 h-4 mr-2" />
            Security Audits
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-zinc-700">
            <Lock className="w-4 h-4 mr-2" />
            Execution Permissions
          </TabsTrigger>
          <TabsTrigger value="credentials" className="data-[state=active]:bg-zinc-700">
            <Key className="w-4 h-4 mr-2" />
            Credential Store
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audits" className="mt-4">
          <CrashProofPanel title="Security Audits">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">Security Findings</CardTitle>
                <CardDescription>Issues detected during security scans</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {audits.map((audit) => {
                      const TypeIcon = typeIcons[audit.type];
                      return (
                        <div
                          key={audit.id}
                          className={`p-4 rounded-lg border ${
                            audit.status === 'open'
                              ? audit.severity === 'critical'
                                ? 'bg-red-500/5 border-red-500/30'
                                : 'bg-zinc-800 border-zinc-700'
                              : 'bg-zinc-800/50 border-zinc-700/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 ${
                                audit.status === 'open' ? (
                                  audit.severity === 'critical' ? 'text-red-500' :
                                  audit.severity === 'high' ? 'text-orange-500' :
                                  audit.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                                ) : 'text-zinc-500'
                              }`}>
                                {audit.status === 'fixed' ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : audit.status === 'ignored' ? (
                                  <XCircle className="w-5 h-5" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <TypeIcon className="w-4 h-4 text-zinc-400" />
                                  <h4 className="font-medium text-white">{audit.title}</h4>
                                  <Badge className={severityColors[audit.severity]}>
                                    {audit.severity}
                                  </Badge>
                                  <Badge className={statusColors[audit.status]}>
                                    {audit.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-zinc-400">{audit.description}</p>
                                <p className="text-xs text-zinc-500 mt-2">
                                  <strong>Recommendation:</strong> {audit.recommendation}
                                </p>
                                {audit.file && (
                                  <p className="text-xs text-zinc-500 mt-1">
                                    <strong>File:</strong> <code className="text-zinc-400">{audit.file}</code>
                                  </p>
                                )}
                              </div>
                            </div>
                            {audit.status === 'open' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => fixAudit(audit.id)}
                                  className="bg-emerald-500 hover:bg-emerald-600"
                                >
                                  <Wrench className="w-3 h-3 mr-1" />
                                  Fix
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => ignoreAudit(audit.id)}
                                  className="bg-zinc-800"
                                >
                                  Ignore
                                </Button>
                              </div>
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
        </TabsContent>

        <TabsContent value="permissions" className="mt-4">
          <CrashProofPanel title="Execution Permissions">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">Agent Execution Permissions</CardTitle>
                <CardDescription>Control what agents can do on your system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executionPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          permission.enabled ? 'bg-emerald-500/10' : 'bg-zinc-700'
                        }`}>
                          <Lock className={`w-5 h-5 ${permission.enabled ? 'text-emerald-500' : 'text-zinc-500'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{permission.name}</h4>
                          <p className="text-sm text-zinc-500">{permission.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-zinc-700 text-xs">
                          Scope: {permission.scope}
                        </Badge>
                        <Switch checked={permission.enabled} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CrashProofPanel>
        </TabsContent>

        <TabsContent value="credentials" className="mt-4">
          <CrashProofPanel title="Credential Store">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">Stored Credentials</CardTitle>
                <CardDescription>Securely stored API keys, tokens, and passwords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Value</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Created</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Last Used</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {credentialStore.map((cred) => (
                        <tr key={cred.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-zinc-400" />
                              <span className="text-sm text-white">{cred.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="bg-zinc-800 text-xs capitalize">
                              {cred.type.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <code className="text-sm text-zinc-400 font-mono">{cred.masked}</code>
                          </td>
                          <td className="py-3 px-4 text-sm text-zinc-400">
                            {cred.created.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-zinc-400">
                            {cred.lastUsed.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </CrashProofPanel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SecurityPage;
