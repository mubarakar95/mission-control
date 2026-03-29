'use client';

import React, { useState } from 'react';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { StatusDot } from '@/components/ui/design-system';
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
  ChevronLeft,
  ChevronRight,
  Zap,
  Settings,
  Bell,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  section?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'overview' },
  { id: 'chat', label: 'Multi-Agent Chat', icon: MessageSquare, section: 'interaction' },
  { id: 'tasks', label: 'Task Management', icon: Kanban, badge: 3, section: 'workflow' },
  { id: 'cron', label: 'Cron & Scheduling', icon: Clock, section: 'automation' },
  { id: 'usage', label: 'Usage & Costs', icon: BarChart3, section: 'analytics' },
  { id: 'org-chart', label: 'Agent Org Chart', icon: Users, section: 'agents' },
  { id: 'memory', label: 'Memory & Vector', icon: Brain, section: 'agents' },
  { id: 'models', label: 'Models & Keys', icon: Key, section: 'configuration' },
  { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope, badge: 2, section: 'system' },
  { id: 'terminal', label: 'Terminal', icon: Terminal, section: 'system' },
  { id: 'channels', label: 'Channels', icon: Radio, section: 'integration' },
  { id: 'explorer', label: 'Document Explorer', icon: FolderOpen, section: 'files' },
  { id: 'security', label: 'Security & Access', icon: Shield, section: 'system' },
];

const sections: Record<string, string> = {
  overview: 'Overview',
  interaction: 'Interaction',
  workflow: 'Workflow',
  automation: 'Automation',
  analytics: 'Analytics',
  agents: 'Agents',
  configuration: 'Configuration',
  system: 'System',
  integration: 'Integration',
  files: 'Files',
};

export function NavigationSidebar() {
  const { sidebarOpen, setSidebarOpen, currentPage, setCurrentPage, agents } = useMissionControlStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const activeAgents = agents.filter(a => a.status === 'active').length;

  const groupedItems = navItems.reduce((acc, item) => {
    const section = item.section || 'other';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 border border-primary/30">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-semibold text-sidebar-foreground text-sm">Mission Control</span>
                <span className="text-xs text-muted-foreground">OpenClaw AI</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4 scrollbar-thin">
          <nav className="px-2 space-y-6">
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section}>
                {sidebarOpen && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {sections[section] || section}
                  </h3>
                )}
                <div className="space-y-1">
                  {items.map((item) => (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setCurrentPage(item.id)}
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                            'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent',
                            currentPage === item.id && 'bg-sidebar-accent text-sidebar-foreground border border-primary/20',
                            !sidebarOpen && 'justify-center'
                          )}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {sidebarOpen && (
                            <>
                              <span className="flex-1 text-left text-sm font-medium">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/15 text-primary">
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                          {!sidebarOpen && item.badge && (
                            <span className="absolute right-1 top-1 w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                      </TooltipTrigger>
                      {!sidebarOpen && (
                        <TooltipContent side="right" className="flex items-center gap-2 bg-popover border-border">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-xs rounded bg-primary/15 text-primary">
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Status Footer */}
        <div className="p-3 border-t border-sidebar-border">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <StatusDot status="active" size="sm" pulse />
                <span className="text-xs text-muted-foreground">
                  {activeAgents}/{agents.length} agents active
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <StatusDot status="active" size="md" pulse />
            </div>
          )}
        </div>

        {/* Control Footer */}
        <div className="border-t border-sidebar-border p-3">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Bell className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Notifications</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand Sidebar</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

export default NavigationSidebar;
