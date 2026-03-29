'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  Users,
  MessageSquare,
  Kanban,
  Clock,
  Brain,
  FileText,
  Database,
  Key,
  Radio,
  Shield,
  Lock,
  Webhook,
  Settings,
  Stethoscope,
  Terminal,
  FileCode,
  Search,
  ArrowRight,
  Command,
  Calendar,
  Plug,
  Heart,
  Volume2,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchItem {
  id: string;
  type: 'page' | 'command' | 'agent';
  title: string;
  description?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
}

const pages: SearchItem[] = [
  { id: 'page-dashboard', type: 'page', title: 'Dashboard', description: 'System overview and monitoring', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'page-activity', type: 'page', title: 'Activity', description: 'Activity feed and history', icon: Activity, href: '/activity' },
  { id: 'page-usage', type: 'page', title: 'Usage & Costs', description: 'Token usage and cost tracking', icon: BarChart3, href: '/usage' },
  { id: 'page-agents', type: 'page', title: 'Agents', description: 'Agent hierarchy and management', icon: Users, href: '/agents' },
  { id: 'page-chat', type: 'page', title: 'Chat', description: 'Chat with agents', icon: MessageSquare, href: '/chat' },
  { id: 'page-tasks', type: 'page', title: 'Tasks', description: 'Kanban board', icon: Kanban, href: '/tasks' },
  { id: 'page-cron', type: 'page', title: 'Cron Jobs', description: 'Scheduled tasks', icon: Clock, href: '/cron' },
  { id: 'page-memory', type: 'page', title: 'Memory', description: 'Long-term memory and journals', icon: Brain, href: '/memory' },
  { id: 'page-documents', type: 'page', title: 'Documents', description: 'Workspace file browser', icon: FileText, href: '/documents' },
  { id: 'page-vectors', type: 'page', title: 'Vector DB', description: 'Vector database management', icon: Database, href: '/vectors' },
  { id: 'page-accounts', type: 'page', title: 'Accounts', description: 'API keys and credentials', icon: Key, href: '/accounts' },
  { id: 'page-channels', type: 'page', title: 'Channels', description: 'Messaging channel config', icon: Radio, href: '/channels' },
  { id: 'page-security', type: 'page', title: 'Security', description: 'Security audits', icon: Shield, href: '/security' },
  { id: 'page-permissions', type: 'page', title: 'Permissions', description: 'Execution permissions', icon: Lock, href: '/permissions' },
  { id: 'page-hooks', type: 'page', title: 'Hooks', description: 'Webhook management', icon: Webhook, href: '/hooks' },
  { id: 'page-settings', type: 'page', title: 'Settings', description: 'User preferences', icon: Settings, href: '/settings' },
  { id: 'page-doctor', type: 'page', title: 'Doctor', description: 'System diagnostics', icon: Stethoscope, href: '/doctor' },
  { id: 'page-terminal', type: 'page', title: 'Terminal', description: 'Built-in terminal', icon: Terminal, href: '/terminal' },
  { id: 'page-logs', type: 'page', title: 'Logs', description: 'Log viewer', icon: FileCode, href: '/logs' },
  { id: 'page-search', type: 'page', title: 'Web Search', description: 'Search functionality', icon: Search, href: '/search' },
  { id: 'page-config', type: 'page', title: 'Config Editor', description: 'Raw configuration', icon: FileCode, href: '/config' },
];

const commands: SearchItem[] = [
  { id: 'cmd-new-task', type: 'command', title: 'Create New Task', description: 'Add a new task to the board', icon: Kanban },
  { id: 'cmd-run-diag', type: 'command', title: 'Run Diagnostics', description: 'Start system health check', icon: Stethoscope },
  { id: 'cmd-new-agent', type: 'command', title: 'Spawn Subagent', description: 'Create a new subagent', icon: Users },
  { id: 'cmd-restart-gw', type: 'command', title: 'Restart Gateway', description: 'Restart the OpenClaw gateway', icon: RotateCw },
];

import { RotateCw } from 'lucide-react';

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const allItems = [...pages, ...commands];

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
        setOpen(true);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleSelect = useCallback((item: SearchItem) => {
    if (item.href) {
      router.push(item.href);
    }
    item.action?.();
    setOpen(false);
    setSearchQuery('');
  }, [router]);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-xl bg-card border-border text-foreground">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search pages, commands, agents..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="border-0 bg-transparent focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">ESC</kbd>
        </div>

        <ScrollArea className="max-h-80">
          <div className="py-2">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 transition-colors',
                    index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-foreground">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      item.type === 'page' && 'bg-primary/10 text-primary',
                      item.type === 'command' && 'bg-muted text-muted-foreground',
                      item.type === 'agent' && 'bg-[var(--success)]/10 text-[var(--success)]'
                    )}
                  >
                    {item.type}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-muted">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-muted">↵</kbd> Select
            </span>
          </div>
          <span>{filteredItems.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchModal;
