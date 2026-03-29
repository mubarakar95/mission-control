/**
 * OpenClaw Path Resolution
 * Resolves paths for OpenClaw CLI, Gateway, and workspace
 */

import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Environment variables
export const ENV = {
  OPENCLAW_HOME: process.env.OPENCLAW_HOME,
  OPENCLAW_BIN: process.env.OPENCLAW_BIN,
  OPENCLAW_WORKSPACE: process.env.OPENCLAW_WORKSPACE,
  OPENCLAW_TRANSPORT: process.env.OPENCLAW_TRANSPORT as 'http' | 'cli' | 'auto' | undefined,
  OPENCLAW_GATEWAY_URL: process.env.OPENCLAW_GATEWAY_URL,
  OPENCLAW_GATEWAY_TOKEN: process.env.OPENCLAW_GATEWAY_TOKEN,
  OPENCLAW_ALLOW_INSECURE_PRIVATE_WS: process.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === 'true',
} as const;

// Default paths
const DEFAULT_OPENCLAW_HOME = join(homedir(), '.openclaw');
const DEFAULT_GATEWAY_PORT = 39200;
const DEFAULT_GATEWAY_HOST = 'localhost';

/**
 * Get OpenClaw home directory
 */
export function getOpenClawHome(): string {
  return ENV.OPENCLAW_HOME || DEFAULT_OPENCLAW_HOME;
}

/**
 * Get OpenClaw binary path
 */
export function getOpenClawBin(): string {
  if (ENV.OPENCLAW_BIN) return ENV.OPENCLAW_BIN;
  
  const home = getOpenClawHome();
  const binaryName = process.platform === 'win32' ? 'openclaw.exe' : 'openclaw';
  return join(home, 'bin', binaryName);
}

/**
 * Get OpenClaw workspace path
 */
export function getOpenClawWorkspace(): string {
  return ENV.OPENCLAW_WORKSPACE || join(getOpenClawHome(), 'workspace');
}

/**
 * Get OpenClaw config path
 */
export function getOpenClawConfigPath(): string {
  return join(getOpenClawHome(), 'config');
}

/**
 * Get OpenClaw data path
 */
export function getOpenClawDataPath(): string {
  return join(getOpenClawHome(), 'data');
}

/**
 * Get OpenClaw logs path
 */
export function getOpenClawLogsPath(): string {
  return join(getOpenClawHome(), 'logs');
}

/**
 * Get Gateway URL
 */
export function getGatewayUrl(): string {
  if (ENV.OPENCLAW_GATEWAY_URL) return ENV.OPENCLAW_GATEWAY_URL;
  return `http://${DEFAULT_GATEWAY_HOST}:${DEFAULT_GATEWAY_PORT}`;
}

/**
 * Get Gateway token
 */
export function getGatewayToken(): string | undefined {
  return ENV.OPENCLAW_GATEWAY_TOKEN;
}

/**
 * Get preferred transport
 */
export function getPreferredTransport(): 'http' | 'cli' | 'auto' {
  return ENV.OPENCLAW_TRANSPORT || 'auto';
}

/**
 * Check if OpenClaw binary exists
 */
export function isOpenClawInstalled(): boolean {
  const binPath = getOpenClawBin();
  return existsSync(binPath);
}

/**
 * Check if OpenClaw home exists
 */
export function isOpenClawHomeExists(): boolean {
  const home = getOpenClawHome();
  return existsSync(home);
}

/**
 * Get all paths as an object
 */
export function getPaths() {
  return {
    home: getOpenClawHome(),
    bin: getOpenClawBin(),
    workspace: getOpenClawWorkspace(),
    config: getOpenClawConfigPath(),
    data: getOpenClawDataPath(),
    logs: getOpenClawLogsPath(),
    gatewayUrl: getGatewayUrl(),
    gatewayToken: getGatewayToken(),
    preferredTransport: getPreferredTransport(),
    isInstalled: isOpenClawInstalled(),
    isHomeExists: isOpenClawHomeExists(),
  };
}

export const paths = {
  getOpenClawHome,
  getOpenClawBin,
  getOpenClawWorkspace,
  getOpenClawConfigPath,
  getOpenClawDataPath,
  getOpenClawLogsPath,
  getGatewayUrl,
  getGatewayToken,
  getPreferredTransport,
  isOpenClawInstalled,
  isOpenClawHomeExists,
  getPaths,
  ENV,
  DEFAULT_GATEWAY_PORT,
  DEFAULT_GATEWAY_HOST,
};
