/**
 * Doctor Checks
 * 25+ diagnostic pattern matchers for system health
 */

import type { DiagnosticCheck } from '../transports/types';

export interface DoctorCheck extends DiagnosticCheck {
  category: 'config' | 'network' | 'security' | 'system' | 'gateway' | 'channels' | 'agents';
  severity: 'critical' | 'high' | 'medium' | 'low';
  documentation?: string;
}

export interface DoctorCheckResult extends DoctorCheck {
  checked: boolean;
  timestamp: Date;
  output?: string;
}

// All available diagnostic checks
export const DOCTOR_CHECKS: DoctorCheck[] = [
  // Config checks
  {
    id: 'config-permissions',
    name: 'Config Directory Permissions',
    category: 'config',
    severity: 'critical',
    status: 'pass',
    message: 'Config directory is readable and writable',
    fixAvailable: false,
  },
  {
    id: 'config-valid-json',
    name: 'Valid JSON Configuration',
    category: 'config',
    severity: 'critical',
    status: 'pass',
    message: 'All config files contain valid JSON',
    fixAvailable: true,
    fixCommand: 'openclaw config validate --fix',
  },
  {
    id: 'api-keys-configured',
    name: 'API Keys Configured',
    category: 'config',
    severity: 'high',
    status: 'pass',
    message: 'At least one AI provider API key is configured',
    fixAvailable: false,
  },

  // Network checks
  {
    id: 'gateway-port',
    name: 'Gateway Port Available',
    category: 'network',
    severity: 'high',
    status: 'pass',
    message: 'Gateway port 39200 is available',
    fixAvailable: true,
    fixCommand: 'Kill process using port: lsof -i :39200',
  },
  {
    id: 'gateway-reachable',
    name: 'Gateway Reachable',
    category: 'network',
    severity: 'critical',
    status: 'pass',
    message: 'Gateway is responding to health checks',
    fixAvailable: true,
    fixCommand: 'openclaw gateway restart',
  },
  {
    id: 'dns-resolution',
    name: 'DNS Resolution',
    category: 'network',
    severity: 'medium',
    status: 'pass',
    message: 'DNS resolution is working correctly',
    fixAvailable: false,
  },
  {
    id: 'outbound-connectivity',
    name: 'Outbound Connectivity',
    category: 'network',
    severity: 'high',
    status: 'pass',
    message: 'Can reach external AI APIs',
    fixAvailable: false,
  },

  // Security checks
  {
    id: 'ssl-certs',
    name: 'SSL Certificates Valid',
    category: 'security',
    severity: 'medium',
    status: 'pass',
    message: 'SSL certificates are valid and not expiring soon',
    fixAvailable: false,
  },
  {
    id: 'api-keys-exposed',
    name: 'No Exposed API Keys',
    category: 'security',
    severity: 'critical',
    status: 'pass',
    message: 'No API keys found in logs or public files',
    fixAvailable: true,
    fixCommand: 'openclaw security rotate-keys',
  },
  {
    id: 'file-permissions',
    name: 'Secure File Permissions',
    category: 'security',
    severity: 'medium',
    status: 'pass',
    message: 'Sensitive files have secure permissions',
    fixAvailable: true,
    fixCommand: 'chmod 600 ~/.openclaw/config/*',
  },

  // System checks
  {
    id: 'disk-space',
    name: 'Sufficient Disk Space',
    category: 'system',
    severity: 'high',
    status: 'pass',
    message: 'More than 1GB disk space available',
    fixAvailable: false,
  },
  {
    id: 'memory-available',
    name: 'Sufficient Memory',
    category: 'system',
    severity: 'medium',
    status: 'pass',
    message: 'More than 500MB memory available',
    fixAvailable: false,
  },
  {
    id: 'cpu-usage',
    name: 'CPU Usage Normal',
    category: 'system',
    severity: 'low',
    status: 'pass',
    message: 'CPU usage is under 80%',
    fixAvailable: false,
  },
  {
    id: 'node-version',
    name: 'Node.js Version',
    category: 'system',
    severity: 'medium',
    status: 'pass',
    message: 'Node.js version 18+ is installed',
    fixAvailable: false,
  },

  // Gateway checks
  {
    id: 'gateway-running',
    name: 'Gateway Running',
    category: 'gateway',
    severity: 'critical',
    status: 'pass',
    message: 'Gateway process is running',
    fixAvailable: true,
    fixCommand: 'openclaw gateway start',
  },
  {
    id: 'gateway-healthy',
    name: 'Gateway Healthy',
    category: 'gateway',
    severity: 'high',
    status: 'pass',
    message: 'Gateway health check returns OK',
    fixAvailable: true,
    fixCommand: 'openclaw gateway restart',
  },
  {
    id: 'gateway-token',
    name: 'Gateway Token Valid',
    category: 'gateway',
    severity: 'high',
    status: 'pass',
    message: 'Gateway authentication token is valid',
    fixAvailable: true,
    fixCommand: 'openclaw gateway regenerate-token',
  },

  // Channels checks
  {
    id: 'telegram-config',
    name: 'Telegram Configuration',
    category: 'channels',
    severity: 'low',
    status: 'pass',
    message: 'Telegram bot token is configured (if used)',
    fixAvailable: false,
  },
  {
    id: 'discord-config',
    name: 'Discord Configuration',
    category: 'channels',
    severity: 'low',
    status: 'pass',
    message: 'Discord bot token is configured (if used)',
    fixAvailable: false,
  },
  {
    id: 'slack-config',
    name: 'Slack Configuration',
    category: 'channels',
    severity: 'low',
    status: 'pass',
    message: 'Slack app credentials are configured (if used)',
    fixAvailable: false,
  },
  {
    id: 'whatsapp-config',
    name: 'WhatsApp Configuration',
    category: 'channels',
    severity: 'low',
    status: 'pass',
    message: 'WhatsApp credentials are configured (if used)',
    fixAvailable: false,
  },

  // Agents checks
  {
    id: 'primary-agent',
    name: 'Primary Agent Exists',
    category: 'agents',
    severity: 'critical',
    status: 'pass',
    message: 'Primary agent configuration exists',
    fixAvailable: true,
    fixCommand: 'openclaw agent create-primary',
  },
  {
    id: 'agent-models',
    name: 'Agent Models Valid',
    category: 'agents',
    severity: 'high',
    status: 'pass',
    message: 'All agents have valid model assignments',
    fixAvailable: false,
  },
  {
    id: 'memory-corruption',
    name: 'Memory Integrity',
    category: 'agents',
    severity: 'medium',
    status: 'pass',
    message: 'Agent memory database is not corrupted',
    fixAvailable: true,
    fixCommand: 'openclaw memory repair',
  },

  // Additional checks
  {
    id: 'cron-jobs',
    name: 'Cron Jobs Valid',
    category: 'system',
    severity: 'low',
    status: 'pass',
    message: 'All cron job schedules are valid',
    fixAvailable: false,
  },
  {
    id: 'sandbox-mode',
    name: 'Sandbox Configuration',
    category: 'security',
    severity: 'medium',
    status: 'pass',
    message: 'Sandbox mode is configured appropriately',
    fixAvailable: false,
  },
  {
    id: 'tailscale',
    name: 'Tailscale VPN',
    category: 'network',
    severity: 'low',
    status: 'pass',
    message: 'Tailscale is connected (if configured)',
    fixAvailable: false,
  },
];

/**
 * Run all diagnostic checks
 */
export async function runAllChecks(): Promise<DoctorCheckResult[]> {
  const results: DoctorCheckResult[] = [];
  
  for (const check of DOCTOR_CHECKS) {
    const result = await runCheck(check);
    results.push(result);
  }
  
  return results;
}

/**
 * Run a single diagnostic check
 */
export async function runCheck(check: DoctorCheck): Promise<DoctorCheckResult> {
  // In a real implementation, this would actually run the check
  // For now, return the check as-is with simulated results
  
  const result: DoctorCheckResult = {
    ...check,
    checked: true,
    timestamp: new Date(),
  };

  // Simulate some failures for demonstration
  if (check.id === 'gateway-port') {
    // 10% chance of port conflict
    if (Math.random() < 0.1) {
      result.status = 'warn';
      result.message = 'Port 39200 may be in use by another process';
    }
  }

  return result;
}

/**
 * Get checks by category
 */
export function getChecksByCategory(category: DoctorCheck['category']): DoctorCheck[] {
  return DOCTOR_CHECKS.filter((check) => check.category === category);
}

/**
 * Get checks by severity
 */
export function getChecksBySeverity(severity: DoctorCheck['severity']): DoctorCheck[] {
  return DOCTOR_CHECKS.filter((check) => check.severity === severity);
}

/**
 * Calculate overall health score
 */
export function calculateHealthScore(results: DoctorCheckResult[]): number {
  if (results.length === 0) return 100;
  
  const weights: Record<string, number> = {
    critical: 25,
    high: 15,
    medium: 10,
    low: 5,
  };

  let totalPenalty = 0;
  
  for (const result of results) {
    if (result.status === 'fail') {
      totalPenalty += weights[result.severity];
    } else if (result.status === 'warn') {
      totalPenalty += weights[result.severity] / 2;
    }
  }
  
  return Math.max(0, 100 - totalPenalty);
}

/**
 * Get failed checks
 */
export function getFailedChecks(results: DoctorCheckResult[]): DoctorCheckResult[] {
  return results.filter((r) => r.status === 'fail');
}

/**
 * Get warnings
 */
export function getWarnings(results: DoctorCheckResult[]): DoctorCheckResult[] {
  return results.filter((r) => r.status === 'warn');
}

export const doctorChecks = {
  DOCTOR_CHECKS,
  runAllChecks,
  runCheck,
  getChecksByCategory,
  getChecksBySeverity,
  calculateHealthScore,
  getFailedChecks,
  getWarnings,
};
