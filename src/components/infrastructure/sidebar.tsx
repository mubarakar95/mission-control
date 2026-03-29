'use client';

import React, { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
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
  Calendar,
  Plug,
  Heart,
  ChevronLeft,
  ChevronRight,
  Zap,
  Bell,
  Volume2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  badgeVariant?: 'default' | 'warning' | 'error';
  section?: string;
  beta?: boolean;
}

const navItems: NavItem[] = [
  // Overview
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'overview' },
  { id: 'activity', label: 'Activity', href: '/activity', icon: Activity, section: 'overview' },
  { id: 'usage', label: 'Usage & Costs', href: '/usage', icon: BarChart3, section: 'overview' },
  
  // Agents
  { id: 'agents', label: 'Agents', href: '/agents', icon: Users, section: 'agents' },
  { id: 'chat', label: 'Chat', href: '/chat', icon: MessageSquare, section: 'agents' },
  { id: 'sessions', label: 'Sessions', href: '/sessions', icon: MessageSquare, section: 'agents' },
  
  // Workflow
  { id: 'tasks', label: 'Tasks', href: '/tasks', icon: Kanban, badge: 3, section: 'workflow' },
  { id: 'calendar', label: 'Calendar', href: '/calendar', icon: Calendar, beta: true, section: 'workflow' },
  { id: 'integrations', label: 'Integrations', href: '/integrations', icon: Plug, beta: true, section: 'workflow' },
  { id: 'cron', label: 'Cron Jobs', href: '/cron', icon: Clock, section: 'workflow' },
  
  // Memory
  { id: 'memory', label: 'Memory', href: '/memory', icon: Brain, section: 'memory' },
  { id: 'documents', label: 'Documents', href: '/documents', icon: FileText, section: 'memory' },
  { id: 'vectors', label: 'Vector DB', href: '/vectors', icon: Database, section: 'memory' },
  
  // Configuration
  { id: 'accounts', label: 'Accounts', href: '/accounts', icon: Key, section: 'config' },
  { id: 'channels', label: 'Channels', href: '/channels', icon: Radio, section: 'config' },
  { id: 'security', label: 'Security', href: '/security', icon: Shield, section: 'config' },
  { id: 'permissions', label: 'Permissions', href: '/permissions', icon: Lock, section: 'config' },
  { id: 'hooks', label: 'Hooks', href: '/hooks', icon: Webhook, section: 'config' },
  
  // System
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings, section: 'system' },
  { id: 'doctor', label: 'Doctor', href: '/doctor', icon: Stethoscope, badge: 2, badgeVariant: 'warning', section: 'system' },
  { id: 'terminal', label: 'Terminal', href: '/terminal', icon: Terminal, section: 'system' },
  { id: 'logs', label: 'Logs', href: '/logs', icon: FileCode, section: 'system' },
  
  // Tools
  { id: 'search', label: 'Web Search', href: '/search', icon: Search, section: 'tools' },
  { id: 'browser', label: 'Browser', href: '/browser', icon: ExternalLink, section: 'tools' },
  { id: 'audio', label: 'Audio', href: '/audio', icon: Volume2, section: 'tools' },
  
  // Network
  { id: 'heartbeat', label: 'Heartbeat', href: '/heartbeat', icon: Heart, section: 'network' },
  { id: 'config', label: 'Config Editor', href: '/config', icon: FileCode, section: 'network' },
];

const sections: Record<string, string> = {
  overview: 'Overview',
  agents: 'Agents',
  workflow: 'Workflow',
  memory: 'Memory',
  config: 'Configuration',
  system: 'System',
  tools: 'Tools',
  network: 'Network',
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

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
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 border border-primary/30">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-sidebar-foreground text-sm">Mission Control</span>
                <span className="text-xs text-muted-foreground">OpenClaw v0.4.9</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4 scrollbar-thin">
          <nav className="px-2 space-y-6">
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section}>
                {!collapsed && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {sections[section] || section}
                  </h3>
                )}
                <div className="space-y-1">
                  {items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                              'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent',
                              isActive && 'bg-sidebar-accent text-sidebar-foreground border border-primary/20',
                              collapsed && 'justify-center'
                            )}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && (
                              <>
                                <span className="flex-1 text-left text-sm font-medium truncate">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'text-[10px] px-1.5 py-0 h-4',
                                      item.badgeVariant === 'warning' && 'bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30',
                                      item.badgeVariant === 'error' && 'bg-[var(--destructive)]/15 text-[var(--destructive)] border-[var(--destructive)]/30',
                                      (!item.badgeVariant || item.badgeVariant === 'default') && 'bg-primary/15 text-primary border-primary/30'
                                    )}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                                {item.beta && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground">
                                    beta
                                  </Badge>
                                )}
                              </>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" className="flex items-center gap-2 bg-popover border-border">
                            <span>{item.label}</span>
                            {item.badge && (
                              <Badge variant="outline" className="text-[10px] bg-primary/15 text-primary">
                                {item.badge}
                              </Badge>
                            )}
                            {item.beta && (
                              <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">
                                beta
                              </Badge>
                            )}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          {collapsed ? (
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(false)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand Sidebar</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

export default Sidebar;
