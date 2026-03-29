/**
 * CLI Transport
 * Communicates with OpenClaw via CLI subprocess
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { getOpenClawBin, isOpenClawInstalled } from '../paths';
import type { TransportResponse, TransportRequest } from './types';

const execAsync = promisify(exec);

export interface CliTransportConfig {
  binaryPath?: string;
  timeout?: number;
  cwd?: string;
}

export class CliTransport {
  private binaryPath: string;
  private timeout: number;
  private cwd: string | undefined;

  constructor(config: CliTransportConfig = {}) {
    this.binaryPath = config.binaryPath || getOpenClawBin();
    this.timeout = config.timeout || 60000;
    this.cwd = config.cwd;
  }

  /**
   * Check if CLI is available
   */
  async isAvailable(): Promise<boolean> {
    if (!isOpenClawInstalled()) {
      return false;
    }
    try {
      await this.runCommand(['--version']);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Run OpenClaw command
   */
  async runCommand(args: string[], input?: string): Promise<TransportResponse<string>> {
    if (!isOpenClawInstalled()) {
      return {
        success: false,
        error: 'OpenClaw binary not found',
      };
    }

    const command = `"${this.binaryPath}" ${args.join(' ')}`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: this.timeout,
        cwd: this.cwd,
        input,
      });

      if (stderr && !stdout) {
        return {
          success: false,
          error: stderr.trim(),
        };
      }

      return {
        success: true,
        data: stdout.trim(),
      };
    } catch (error) {
      const err = error as Error & { code?: number; stderr?: string };
      return {
        success: false,
        error: err.stderr || err.message,
        code: err.code,
      };
    }
  }

  /**
   * Run command and parse JSON output
   */
  async runCommandJson<T>(args: string[], input?: string): Promise<TransportResponse<T>> {
    const result = await this.runCommand([...args, '--json'], input);
    
    if (!result.success || !result.data) {
      return result as TransportResponse<T>;
    }

    try {
      const data = JSON.parse(result.data) as T;
      return { success: true, data };
    } catch (parseError) {
      return {
        success: false,
        error: `Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Execute a transport request
   */
  async execute(request: TransportRequest): Promise<TransportResponse> {
    const args = [request.command, ...(request.args || [])];
    return this.runCommandJson(args, request.input);
  }

  /**
   * Get version
   */
  async getVersion(): Promise<string | null> {
    const result = await this.runCommand(['--version']);
    return result.success ? result.data || null : null;
  }

  /**
   * Get gateway status
   */
  async getGatewayStatus(): Promise<{ running: boolean; pid?: number }> {
    const result = await this.runCommand(['gateway', 'status']);
    if (result.success && result.data) {
      const match = result.data.match(/running.*pid[:\s]+(\d+)/i);
      if (match) {
        return { running: true, pid: parseInt(match[1], 10) };
      }
      return { running: result.data.toLowerCase().includes('running') };
    }
    return { running: false };
  }

  /**
   * Start gateway
   */
  async startGateway(): Promise<TransportResponse> {
    return this.runCommand(['gateway', 'start']);
  }

  /**
   * Stop gateway
   */
  async stopGateway(): Promise<TransportResponse> {
    return this.runCommand(['gateway', 'stop']);
  }

  /**
   * Restart gateway
   */
  async restartGateway(): Promise<TransportResponse> {
    return this.runCommand(['gateway', 'restart']);
  }
}

// Singleton instance
let cliTransportInstance: CliTransport | null = null;

export function getCliTransport(config?: CliTransportConfig): CliTransport {
  if (!cliTransportInstance || config) {
    cliTransportInstance = new CliTransport(config);
  }
  return cliTransportInstance;
}

export const cliTransport = {
  getCliTransport,
  CliTransport,
};
