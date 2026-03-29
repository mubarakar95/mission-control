/**
 * HTTP Transport
 * Communicates with OpenClaw Gateway via HTTP/WebSocket
 */

import { getGatewayUrl, getGatewayToken } from '../paths';
import type { TransportResponse, GatewayStatus, TransportRequest } from './types';

export interface HttpTransportConfig {
  baseUrl?: string;
  token?: string;
  timeout?: number;
}

export class HttpTransport {
  private baseUrl: string;
  private token: string | undefined;
  private timeout: number;
  private abortController: AbortController | null = null;

  constructor(config: HttpTransportConfig = {}) {
    this.baseUrl = config.baseUrl || getGatewayUrl();
    this.token = config.token || getGatewayToken();
    this.timeout = config.timeout || 30000;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async fetchWithTimeout<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<TransportResponse<T>> {
    this.abortController = new AbortController();
    const timeoutId = setTimeout(() => this.abortController?.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        signal: this.abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: errorText || `HTTP ${response.status}`,
          code: response.status,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout',
          code: 408,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if gateway is online
   */
  async checkStatus(): Promise<GatewayStatus> {
    const startTime = Date.now();
    try {
      const response = await this.fetchWithTimeout<{
        version: string;
        uptime: number;
      }>('/api/status');

      if (response.success && response.data) {
        return {
          online: true,
          version: response.data.version,
          uptime: response.data.uptime,
          lastCheck: new Date(),
          responseTime: Date.now() - startTime,
        };
      }

      return {
        online: false,
        lastCheck: new Date(),
        error: response.error,
      };
    } catch (error) {
      return {
        online: false,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<TransportResponse<T>> {
    return this.fetchWithTimeout<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body: unknown): Promise<TransportResponse<T>> {
    return this.fetchWithTimeout<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body: unknown): Promise<TransportResponse<T>> {
    return this.fetchWithTimeout<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<TransportResponse<T>> {
    return this.fetchWithTimeout<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Execute a command via gateway
   */
  async execute(request: TransportRequest): Promise<TransportResponse> {
    return this.post('/api/execute', request);
  }

  /**
   * Cancel any pending request
   */
  cancel(): void {
    this.abortController?.abort();
  }

  /**
   * Check if transport is available
   */
  async isAvailable(): Promise<boolean> {
    const status = await this.checkStatus();
    return status.online;
  }
}

// Singleton instance
let httpTransportInstance: HttpTransport | null = null;

export function getHttpTransport(config?: HttpTransportConfig): HttpTransport {
  if (!httpTransportInstance || config) {
    httpTransportInstance = new HttpTransport(config);
  }
  return httpTransportInstance;
}

export const httpTransport = {
  getHttpTransport,
  HttpTransport,
};
