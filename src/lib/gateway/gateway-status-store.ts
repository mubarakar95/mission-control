/**
 * Gateway Status Store
 * Real-time gateway health monitoring with polling
 */

import { create } from 'zustand';
import type { GatewayHealth, GatewayStatus } from '../transports/types';

interface GatewayStatusState {
  status: GatewayStatus;
  isPolling: boolean;
  lastCheck: Date | null;
  error: string | null;
  
  // Actions
  setStatus: (status: GatewayStatus) => void;
  setPolling: (polling: boolean) => void;
  setError: (error: string | null) => void;
  startPolling: () => void;
  stopPolling: () => void;
  checkStatus: () => Promise<void>;
}

// Default offline status
const defaultStatus: GatewayStatus = {
  online: false,
  lastCheck: new Date(),
  error: 'Not checked',
};

// Polling interval in milliseconds
const POLL_INTERVAL = 12000; // 12 seconds

// Store for polling interval reference
let pollingInterval: NodeJS.Timeout | null = null;

export const useGatewayStatusStore = create<GatewayStatusState>((set, get) => ({
  status: defaultStatus,
  isPolling: false,
  lastCheck: null,
  error: null,

  setStatus: (status) => set({ status, lastCheck: new Date() }),
  
  setPolling: (polling) => set({ isPolling: polling }),
  
  setError: (error) => set({ error }),

  checkStatus: async () => {
    try {
      // In a real implementation, this would call the HTTP transport
      // For now, simulate a status check
      const response = await fetch('/api/gateway/status');
      
      if (response.ok) {
        const data = await response.json();
        set({
          status: {
            online: true,
            version: data.version,
            uptime: data.uptime,
            lastCheck: new Date(),
            responseTime: data.responseTime,
          },
          error: null,
        });
      } else {
        set({
          status: {
            online: false,
            lastCheck: new Date(),
            error: `HTTP ${response.status}`,
          },
        });
      }
    } catch (error) {
      set({
        status: {
          online: false,
          lastCheck: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  },

  startPolling: () => {
    if (pollingInterval) return;
    
    set({ isPolling: true });
    
    // Initial check
    get().checkStatus();
    
    // Set up polling
    pollingInterval = setInterval(() => {
      get().checkStatus();
    }, POLL_INTERVAL);
  },

  stopPolling: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    set({ isPolling: false });
  },
}));

// Export for cleanup
export const gatewayPolling = {
  stop: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },
};
