'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusDot } from '@/components/ui/design-system';
import {
  Bell,
  Search,
  Moon,
  Sun,
  Power,
  RotateCw,
  MessageSquare,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useGatewayStatusStore } from '@/lib/gateway/gateway-status-store';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { status } = useGatewayStatusStore();

  const handleGatewayAction = (action: 'start' | 'stop' | 'restart') => {
    fetch('/api/gateway/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
  };

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-card/50 backdrop-blur-sm">
      {/* Left: Gateway Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <StatusDot
            status={status.online ? 'active' : 'error'}
            pulse={status.online}
            size="md"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Gateway</span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] px-1.5 py-0 h-4',
                  status.online
                    ? 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30'
                    : 'bg-[var(--destructive)]/15 text-[var(--destructive)] border-[var(--destructive)]/30'
                )}
              >
                {status.online ? 'Online' : 'Offline'}
              </Badge>
            </div>
            {status.version && (
              <span className="text-xs text-muted-foreground">v{status.version}</span>
            )}
          </div>
        </div>

        {/* Gateway Controls */}
        <div className="flex items-center gap-1 ml-4">
          {!status.online ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGatewayAction('start')}
              className="h-7 gap-1.5 text-xs"
            >
              <Power className="w-3.5 h-3.5" />
              Start
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleGatewayAction('restart')}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Restart Gateway"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleGatewayAction('stop')}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Stop Gateway"
              >
                <Power className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Response Time */}
        {status.online && status.responseTime && (
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span>{status.responseTime}ms</span>
          </div>
        )}

        {/* Search */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 text-muted-foreground"
          onClick={() => {
            // Open search modal via keyboard shortcut
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
          }}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-muted">
            ⌘K
          </kbd>
        </Button>

        {/* Agent Chat Panel Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
          title="Agent Chat"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--warning)]" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}

export default Header;
