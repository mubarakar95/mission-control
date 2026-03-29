'use client';

import React, { useEffect, ReactNode } from 'react';
import { Sidebar } from '@/components/infrastructure/sidebar';
import { Header } from '@/components/infrastructure/header';
import { SearchModal } from '@/components/infrastructure/search-modal';
import { PanelErrorBoundary } from '@/components/infrastructure/panel-error-boundary';
import { GatewayOfflineBanner } from '@/components/infrastructure/gateway-offline-banner';
import { useGatewayStatusStore } from '@/lib/gateway/gateway-status-store';
import { cn } from '@/lib/utils';

interface MissionControlLayoutProps {
  children: ReactNode;
}

export function MissionControlLayout({ children }: MissionControlLayoutProps) {
  const { status, startPolling, stopPolling } = useGatewayStatusStore();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Offline Banner */}
        {!status.online && <GatewayOfflineBanner />}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <PanelErrorBoundary>
            {children}
          </PanelErrorBoundary>
        </main>
      </div>

      {/* Global Search Modal */}
      <SearchModal />
    </div>
  );
}

export default MissionControlLayout;
