'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  Key,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  GripVertical,
} from 'lucide-react';

interface ModelConfig {
  id: string;
  provider: string;
  name: string;
  apiKey: string;
  baseUrl?: string;
  status: 'active' | 'inactive' | 'error';
  usage: number;
  cost: number;
}

const modelConfigs: ModelConfig[] = [
  { id: '1', provider: 'OpenAI', name: 'GPT-4 Turbo', apiKey: 'sk-...abc123', status: 'active', usage: 125000, cost: 125 },
  { id: '2', provider: 'OpenAI', name: 'GPT-4o', apiKey: 'sk-...def456', status: 'active', usage: 85000, cost: 85 },
  { id: '3', provider: 'Anthropic', name: 'Claude 3 Opus', apiKey: 'sk-ant-...xyz', status: 'active', usage: 72000, cost: 108 },
  { id: '4', provider: 'Google', name: 'Gemini Pro', apiKey: 'AIza...', status: 'inactive', usage: 0, cost: 0 },
];

const fallbackChains = [
  {
    id: 'fc1',
    name: 'Primary Chain',
    models: ['GPT-4 Turbo', 'Claude 3 Opus', 'GPT-4o'],
    active: true,
  },
  {
    id: 'fc2',
    name: 'Budget Chain',
    models: ['GPT-4o', 'Gemini Pro'],
    active: true,
  },
];

const agentAssignments = [
  { agentId: 'agent-1', agentName: 'Primary Agent', model: 'GPT-4 Turbo' },
  { agentId: 'agent-2', agentName: 'Research Assistant', model: 'Claude 3 Opus' },
  { agentId: 'agent-3', agentName: 'Code Generator', model: 'GPT-4o' },
];

export function ModelsPage() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newModel, setNewModel] = useState({
    provider: '',
    name: '',
    apiKey: '',
  });

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Models & Keys</h2>
          <p className="text-zinc-500">Manage API keys and model configurations</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>Add New Model</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-zinc-400">Provider</label>
                <Select value={newModel.provider} onValueChange={(v) => setNewModel({ ...newModel, provider: v })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="cohere">Cohere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Model Name</label>
                <Input
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  placeholder="gpt-4-turbo"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">API Key</label>
                <Input
                  type="password"
                  value={newModel.apiKey}
                  onChange={(e) => setNewModel({ ...newModel, apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <Button
                onClick={() => setIsAddOpen(false)}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
              >
                Add Model
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="keys">
        <TabsList className="bg-zinc-800 border border-zinc-700">
          <TabsTrigger value="keys" className="data-[state=active]:bg-zinc-700">
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="fallback" className="data-[state=active]:bg-zinc-700">
            <Zap className="w-4 h-4 mr-2" />
            Fallback Chains
          </TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-zinc-700">
            <ArrowRight className="w-4 h-4 mr-2" />
            Agent Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="mt-4">
          <CrashProofPanel title="API Keys">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Provider</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Model</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">API Key</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">Usage</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-zinc-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelConfigs.map((model) => (
                        <tr key={model.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="bg-zinc-800">{model.provider}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-white">{model.name}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <code className="text-sm text-zinc-400 font-mono">
                                {visibleKeys.has(model.id) ? model.apiKey : '••••••••••••'}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-zinc-400 hover:text-white"
                                onClick={() => toggleKeyVisibility(model.id)}
                              >
                                {visibleKeys.has(model.id) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-zinc-400 hover:text-white"
                                onClick={() => navigator.clipboard.writeText(model.apiKey)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={
                              model.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                              model.status === 'error' ? 'bg-red-500/20 text-red-400' :
                              'bg-zinc-500/20 text-zinc-400'
                            }>
                              {model.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-zinc-300">
                            {model.usage.toLocaleString()} tokens
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                <Edit className="w-4 h-4" />
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

        <TabsContent value="fallback" className="mt-4">
          <CrashProofPanel title="Fallback Chains">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">Fallback Chains</CardTitle>
                <CardDescription>Configure automatic model fallbacks when rate limits or errors occur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fallbackChains.map((chain) => (
                    <div key={chain.id} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{chain.name}</span>
                          <Switch checked={chain.active} />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {chain.models.map((model, i) => (
                          <React.Fragment key={model}>
                            <Badge variant="outline" className="bg-zinc-700">{model}</Badge>
                            {i < chain.models.length - 1 && <ArrowRight className="w-4 h-4 text-zinc-500" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Fallback Chain
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CrashProofPanel>
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <CrashProofPanel title="Agent Assignments">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">Model Assignments</CardTitle>
                <CardDescription>Assign specific models to agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentAssignments.map((assignment) => (
                    <div key={assignment.agentId} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400">
                          <Zap className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-white">{assignment.agentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={assignment.model}>
                          <SelectTrigger className="w-40 bg-zinc-700 border-zinc-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {modelConfigs.filter(m => m.status === 'active').map((model) => (
                              <SelectItem key={model.id} value={model.name}>{model.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CrashProofPanel>
        </TabsContent>
      </Tabs>

      {/* Security Notice */}
      <Card className="bg-amber-500/10 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-400">Security Notice</h4>
              <p className="text-sm text-zinc-400 mt-1">
                API keys are stored securely and masked by default. Never share your API keys or commit them to version control.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ModelsPage;
