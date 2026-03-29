'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Power, RotateCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GatewayOfflineBannerProps {
  className?: string;
  onDismiss?: () => void;
}

export function GatewayOfflineBanner({ className, onDismiss }: GatewayOfflineBannerProps) {
  const handleStart = () => {
    fetch('/api/gateway/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start' }),
    });
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-2.5 bg-[var(--warning)]/10 border-b border-[var(--warning)]/20',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
        <span className="text-sm text-foreground">
          <strong>Gateway Offline</strong> — The OpenClaw gateway is not running. Some features may not be available.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleStart}
          className="h-7 gap-1.5 text-xs bg-[var(--warning)]/15 border-[var(--warning)]/30 text-[var(--warning)] hover:bg-[var(--warning)]/25"
        >
          <Power className="w-3.5 h-3.5" />
          Start Gateway
        </Button>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default GatewayOfflineBanner;
