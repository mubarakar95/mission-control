/**
 * Auto Transport
 * Automatically selects the best available transport (HTTP preferred, CLI fallback)
 */

import { getHttpTransport, HttpTransport } from './http-transport';
import { getCliTransport, CliTransport } from './cli-transport';
import { getPreferredTransport } from '../paths';
import type { TransportResponse, TransportRequest, TransportType } from './types';

export interface AutoTransportConfig {
  preferHttp?: boolean;
  fallbackToCli?: boolean;
  httpTimeout?: number;
  cliTimeout?: number;
}

export class AutoTransport {
  private httpTransport: HttpTransport;
  private cliTransport: CliTransport;
  private preferHttp: boolean;
  private fallbackToCli: boolean;
  private cachedTransport: TransportType | null = null;
  private lastCheck: number = 0;
  private cacheDuration: number = 30000; // 30 seconds

  constructor(config: AutoTransportConfig = {}) {
    this.httpTransport = getHttpTransport({ timeout: config.httpTimeout });
    this.cliTransport = getCliTransport({ timeout: config.cliTimeout });
    this.preferHttp = config.preferHttp ?? true;
    this.fallbackToCli = config.fallbackToCli ?? true;
  }

  /**
   * Detect and return the best available transport
   */
  async detectTransport(): Promise<TransportType> {
    const now = Date.now();
    
    // Use cached result if still valid
    if (this.cachedTransport && (now - this.lastCheck) < this.cacheDuration) {
      return this.cachedTransport;
    }

    // Check preferred transport from environment
    const preferred = getPreferredTransport();
    if (preferred === 'http') {
      const httpAvailable = await this.httpTransport.isAvailable();
      if (httpAvailable) {
        this.cachedTransport = 'http';
        this.lastCheck = now;
        return 'http';
      }
    } else if (preferred === 'cli') {
      const cliAvailable = await this.cliTransport.isAvailable();
      if (cliAvailable) {
        this.cachedTransport = 'cli';
        this.lastCheck = now;
        return 'cli';
      }
    }

    // Auto-detect: prefer HTTP, fallback to CLI
    if (this.preferHttp) {
      const httpAvailable = await this.httpTransport.isAvailable();
      if (httpAvailable) {
        this.cachedTransport = 'http';
        this.lastCheck = now;
        return 'http';
      }
    }

    if (this.fallbackToCli) {
      const cliAvailable = await this.cliTransport.isAvailable();
      if (cliAvailable) {
        this.cachedTransport = 'cli';
        this.lastCheck = now;
        return 'cli';
      }
    }

    // Default to HTTP even if unavailable (for better error messages)
    return 'http';
  }

  /**
   * Execute a request using the best available transport
   */
  async execute<T = unknown>(request: TransportRequest): Promise<TransportResponse<T>> {
    const transport = await this.detectTransport();
    
    if (transport === 'http') {
      return this.httpTransport.execute(request) as Promise<TransportResponse<T>>;
    }
    
    return this.cliTransport.execute(request) as Promise<TransportResponse<T>>;
  }

  /**
   * GET request (HTTP only)
   */
  async get<T>(endpoint: string): Promise<TransportResponse<T>> {
    const transport = await this.detectTransport();
    
    if (transport === 'http') {
      return this.httpTransport.get<T>(endpoint);
    }
    
    // CLI fallback for certain endpoints
    return this.cliTransport.execute({
      command: 'api',
      args: ['get', endpoint],
    }) as Promise<TransportResponse<T>>;
  }

  /**
   * POST request (HTTP only)
   */
  async post<T>(endpoint: string, body: unknown): Promise<TransportResponse<T>> {
    const transport = await this.detectTransport();
    
    if (transport === 'http') {
      return this.httpTransport.post<T>(endpoint, body);
    }
    
    return this.cliTransport.execute({
      command: 'api',
      args: ['post', endpoint],
      input: JSON.stringify(body),
    }) as Promise<TransportResponse<T>>;
  }

  /**
   * PUT request (HTTP only)
   */
  async put<T>(endpoint: string, body: unknown): Promise<TransportResponse<T>> {
    const transport = await this.detectTransport();
    
    if (transport === 'http') {
      return this.httpTransport.put<T>(endpoint, body);
    }
    
    return this.cliTransport.execute({
      command: 'api',
      args: ['put', endpoint],
      input: JSON.stringify(body),
    }) as Promise<TransportResponse<T>>;
  }

  /**
   * DELETE request (HTTP only)
   */
  async delete<T>(endpoint: string): Promise<TransportResponse<T>> {
    const transport = await this.detectTransport();
    
    if (transport === 'http') {
      return this.httpTransport.delete<T>(endpoint);
    }
    
    return this.cliTransport.execute({
      command: 'api',
      args: ['delete', endpoint],
    }) as Promise<TransportResponse<T>>;
  }

  /**
   * Get current transport type
   */
  getCurrentTransport(): TransportType | null {
    return this.cachedTransport;
  }

  /**
   * Clear cached transport (force re-detection)
   */
  clearCache(): void {
    this.cachedTransport = null;
    this.lastCheck = 0;
  }

  /**
   * Get underlying transports
   */
  getHttpTransport(): HttpTransport {
    return this.httpTransport;
  }

  getCliTransport(): CliTransport {
    return this.cliTransport;
  }
}

// Singleton instance
let autoTransportInstance: AutoTransport | null = null;

export function getAutoTransport(config?: AutoTransportConfig): AutoTransport {
  if (!autoTransportInstance || config) {
    autoTransportInstance = new AutoTransport(config);
  }
  return autoTransportInstance;
}

export const autoTransport = {
  getAutoTransport,
  AutoTransport,
};
