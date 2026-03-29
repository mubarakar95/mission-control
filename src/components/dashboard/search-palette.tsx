'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Clock,
  BarChart3,
  Users,
  Brain,
  Key,
  Stethoscope,
  Terminal,
  Radio,
  FolderOpen,
  Shield,
  Search,
  File,
  Command,
  ArrowRight,
} from 'lucide-react';

interface SearchItem {
  id: string;
  type: 'page' | 'file' | 'command' | 'memory';
  title: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
}

export function SearchPalette() {
  const { searchOpen, setSearchOpen, setCurrentPage, agents, tasks } = useMissionControlStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const pages: SearchItem[] = [
    { id: 'page-dashboard', type: 'page', title: 'Dashboard', description: 'System overview and monitoring', icon: LayoutDashboard, action: () => setCurrentPage('dashboard') },
    { id: 'page-chat', type: 'page', title: 'Multi-Agent Chat', description: 'Chat with AI agents', icon: MessageSquare, action: () => setCurrentPage('chat') },
    { id: 'page-tasks', type: 'page', title: 'Task Management', description: 'Kanban board for tasks', icon: Kanban, action: () => setCurrentPage('tasks') },
    { id: 'page-cron', type: 'page', title: 'Cron & Scheduling', description: 'Manage scheduled tasks', icon: Clock, action: () => setCurrentPage('cron') },
    { id: 'page-usage', type: 'page', title: 'Usage & Costs', description: 'Analytics and cost tracking', icon: BarChart3, action: () => setCurrentPage('usage') },
    { id: 'page-org-chart', type: 'page', title: 'Agent Org Chart', description: 'Agent hierarchy visualization', icon: Users, action: () => setCurrentPage('org-chart') },
    { id: 'page-memory', type: 'page', title: 'Memory & Vector Search', description: 'Agent memory management', icon: Brain, action: () => setCurrentPage('memory') },
    { id: 'page-models', type: 'page', title: 'Models & Keys', description: 'API key management', icon: Key, action: () => setCurrentPage('models') },
    { id: 'page-diagnostics', type: 'page', title: 'Diagnostics', description: 'System health checks', icon: Stethoscope, action: () => setCurrentPage('diagnostics') },
    { id: 'page-terminal', type: 'page', title: 'Terminal', description: 'Web terminal access', icon: Terminal, action: () => setCurrentPage('terminal') },
    { id: 'page-channels', type: 'page', title: 'Channels', description: 'Platform integrations', icon: Radio, action: () => setCurrentPage('channels') },
    { id: 'page-explorer', type: 'page', title: 'Document Explorer', description: 'File browser', icon: FolderOpen, action: () => setCurrentPage('explorer') },
    { id: 'page-security', type: 'page', title: 'Security & Access', description: 'Security audit panel', icon: Shield, action: () => setCurrentPage('security') },
  ];

  const commands: SearchItem[] = [
    { id: 'cmd-new-task', type: 'command', title: 'Create New Task', description: 'Add a new task to the board', icon: Command, action: () => setCurrentPage('tasks') },
    { id: 'cmd-run-diag', type: 'command', title: 'Run Diagnostics', description: 'Start system health check', icon: Stethoscope, action: () => setCurrentPage('diagnostics') },
    { id: 'cmd-new-agent', type: 'command', title: 'Deploy New Agent', description: 'Create a new subagent', icon: Users, action: () => setCurrentPage('org-chart') },
  ];

  const agentItems: SearchItem[] = agents.map((agent) => ({
    id: `agent-${agent.id}`,
    type: 'memory' as const,
    title: agent.name,
    description: `${agent.status} • ${agent.model}`,
    icon: agent.status === 'active' ? Users : Users,
    action: () => setCurrentPage('org-chart'),
  }));

  const taskItems: SearchItem[] = tasks.slice(0, 5).map((task) => ({
    id: `task-${task.id}`,
    type: 'file' as const,
    title: task.title,
    description: `${task.status} • ${task.priority} priority`,
    icon: File,
    action: () => setCurrentPage('tasks'),
  }));

  const allItems = [...pages, ...commands, ...agentItems, ...taskItems];

  const filteredItems = searchQuery
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allItems;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  const handleSelect = useCallback((item: SearchItem) => {
    item.action();
    setSearchOpen(false);
    setSearchQuery('');
  }, [setSearchOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="p-0 max-w-xl bg-zinc-900 border-zinc-800 text-white">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-500" />
          <Input
            placeholder="Search pages, agents, commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-zinc-500"
            autoFocus
          />
          <kbd className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-500">ESC</kbd>
        </div>

        <ScrollArea className="max-h-80">
          <div className="py-2">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-zinc-500">
                No results found for "{searchQuery}"
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 transition-colors',
                    index === selectedIndex ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                  )}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800">
                    <item.icon className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-zinc-500">{item.description}</div>
                    )}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 capitalize">
                    {item.type}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-zinc-800">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-zinc-800">↵</kbd> Select
            </span>
          </div>
          <span>{filteredItems.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchPalette;
