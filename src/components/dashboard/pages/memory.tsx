'use client';

import React, { useState } from 'react';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  Brain,
  Search,
  Book,
  Calendar,
  Edit,
  Trash2,
  Plus,
  FileText,
  Clock,
  Tag,
  Database,
  Sparkles,
} from 'lucide-react';

// Mock memory data
const longTermMemory = [
  { id: '1', content: 'User prefers dark mode for all interfaces', category: 'preferences', createdAt: new Date('2024-02-01') },
  { id: '2', content: 'Primary workflow: code review -> testing -> deployment', category: 'workflow', createdAt: new Date('2024-01-15') },
  { id: '3', content: 'API endpoint for user authentication: /api/v2/auth', category: 'technical', createdAt: new Date('2024-01-20') },
  { id: '4', content: 'Weekly reports sent every Monday at 8 AM', category: 'scheduling', createdAt: new Date('2024-02-10') },
];

const journalEntries = [
  { id: 'j1', date: new Date('2024-03-15'), content: 'Successfully deployed new agent orchestration system. Improved response time by 35%.', mood: 'productive' },
  { id: 'j2', date: new Date('2024-03-14'), content: 'Fixed critical bug in memory management. Reduced memory leaks significantly.', mood: 'focused' },
  { id: 'j3', date: new Date('2024-03-13'), content: 'Integrated new vector search capabilities. Semantic queries now 2x faster.', mood: 'excited' },
];

const vectorSearchResults = [
  { id: 'v1', content: 'API endpoint configuration...', similarity: 0.95 },
  { id: 'v2', content: 'User preference for notifications...', similarity: 0.87 },
  { id: 'v3', content: 'Deployment workflow documentation...', similarity: 0.82 },
];

export function MemoryPage() {
  const { agents } = useMissionControlStore();
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('memory');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Memory & Vector Search</h2>
          <p className="text-zinc-500">Manage agent memory and perform semantic searches</p>
        </div>
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vector Search */}
      <CrashProofPanel title="Vector Search">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" />
              Semantic Search
            </CardTitle>
            <CardDescription>Search through agent memory using natural language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  placeholder="Search memory semantically..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700"
                />
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {searchQuery && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium text-zinc-400">Results</h4>
                {vectorSearchResults.map((result) => (
                  <div key={result.id} className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-white">{result.content}</p>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400">
                        {(result.similarity * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </CrashProofPanel>

      {/* Tabs for Memory and Journal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800 border border-zinc-700">
          <TabsTrigger value="memory" className="data-[state=active]:bg-zinc-700">
            <Brain className="w-4 h-4 mr-2" />
            Long-Term Memory
          </TabsTrigger>
          <TabsTrigger value="journal" className="data-[state=active]:bg-zinc-700">
            <Calendar className="w-4 h-4 mr-2" />
            Daily Journal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memory" className="mt-4">
          <CrashProofPanel title="Long-Term Memory">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Long-Term Memory</CardTitle>
                  <CardDescription>Persistent memories stored by the agent</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="bg-zinc-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Memory
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {longTermMemory.map((memory) => (
                      <div
                        key={memory.id}
                        className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm text-white">{memory.content}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline" className="bg-zinc-700 text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {memory.category}
                              </Badge>
                              <span className="text-xs text-zinc-500">
                                {memory.createdAt.toLocaleDateString()}
                              </span>
                            </div>
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
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </CrashProofPanel>
        </TabsContent>

        <TabsContent value="journal" className="mt-4">
          <CrashProofPanel title="Daily Journal">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Daily Journal</CardTitle>
                  <CardDescription>Agent activity logs and reflections</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="bg-zinc-800">
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {journalEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 bg-zinc-800 rounded-lg border border-zinc-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-zinc-400" />
                            <span className="text-sm font-medium text-white">
                              {entry.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              entry.mood === 'productive' ? 'bg-emerald-500/10 text-emerald-400' :
                              entry.mood === 'focused' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {entry.mood}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-300">{entry.content}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-zinc-400 hover:text-white">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-zinc-400 hover:text-red-400">
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </CrashProofPanel>
        </TabsContent>
      </Tabs>

      {/* Memory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{longTermMemory.length}</p>
                <p className="text-xs text-zinc-500">Memory Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Book className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{journalEntries.length}</p>
                <p className="text-xs text-zinc-500">Journal Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1.2M</p>
                <p className="text-xs text-zinc-500">Vectors Indexed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MemoryPage;
