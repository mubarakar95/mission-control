'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  MinusCircle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

// ============================================
// Status Badge Component
// ============================================

const statusBadgeVariants = cva(
  'font-medium border transition-colors',
  {
    variants: {
      status: {
        active: 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30',
        inactive: 'bg-muted text-muted-foreground border-muted',
        pending: 'bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30',
        error: 'bg-[var(--destructive)]/15 text-[var(--destructive)] border-[var(--destructive)]/30',
        running: 'bg-[var(--info)]/15 text-[var(--info)] border-[var(--info)]/30',
        paused: 'bg-muted/50 text-muted-foreground border-muted',
        connected: 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30',
        disconnected: 'bg-muted text-muted-foreground border-muted',
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2 py-0.5',
        lg: 'text-sm px-2.5 py-1',
      },
    },
    defaultVariants: {
      status: 'active',
      size: 'md',
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, size, children, className, showDot = true }: StatusBadgeProps) {
  const dotColor = {
    active: 'bg-[var(--success)]',
    inactive: 'bg-muted-foreground',
    pending: 'bg-[var(--warning)]',
    error: 'bg-[var(--destructive)]',
    running: 'bg-[var(--info)]',
    paused: 'bg-muted-foreground',
    connected: 'bg-[var(--success)]',
    disconnected: 'bg-muted-foreground',
  };

  return (
    <Badge variant="outline" className={cn(statusBadgeVariants({ status, size }), className)}>
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dotColor[status || 'inactive'])} />
      )}
      {children}
    </Badge>
  );
}

// ============================================
// Status Dot Component
// ============================================

const statusDotVariants = cva(
  'rounded-full transition-all',
  {
    variants: {
      status: {
        active: 'bg-[var(--success)] shadow-[0_0_8px_var(--success)]',
        inactive: 'bg-muted-foreground',
        pending: 'bg-[var(--warning)] shadow-[0_0_8px_var(--warning)]',
        error: 'bg-[var(--destructive)] shadow-[0_0_8px_var(--destructive)]',
        running: 'bg-[var(--info)] shadow-[0_0_8px_var(--info)]',
        paused: 'bg-muted-foreground',
        connected: 'bg-[var(--success)] shadow-[0_0_8px_var(--success)]',
        disconnected: 'bg-muted-foreground',
      },
      size: {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
      },
      pulse: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      status: 'active',
      size: 'md',
      pulse: false,
    },
  }
);

interface StatusDotProps extends VariantProps<typeof statusDotVariants> {
  className?: string;
}

export function StatusDot({ status, size, pulse, className }: StatusDotProps) {
  return (
    <span className={cn(statusDotVariants({ status, size, pulse }), className)} />
  );
}

// ============================================
// Metric Card Component
// ============================================

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ElementType;
  trend?: {
    value: number;
    label?: string;
  };
  status?: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export function MetricCard({ title, value, description, icon: Icon, trend, status = 'neutral', className }: MetricCardProps) {
  const trendColors = {
    up: trend?.value && trend.value >= 0 ? 'text-[var(--success)]' : 'text-[var(--destructive)]',
    down: trend?.value && trend.value < 0 ? 'text-[var(--success)]' : 'text-[var(--destructive)]',
  };

  const statusColors = {
    success: 'text-[var(--success)]',
    warning: 'text-[var(--warning)]',
    error: 'text-[var(--destructive)]',
    neutral: 'text-primary',
  };

  return (
    <Card className={cn('bg-card border-border hover:border-primary/30 transition-all duration-200', className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                {trend.value >= 0 ? (
                  <TrendingUp className={cn('w-3.5 h-3.5', trendColors.up)} />
                ) : trend.value < 0 ? (
                  <TrendingDown className={cn('w-3.5 h-3.5', trendColors.down)} />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className={trend.value >= 0 ? trendColors.up : trendColors.down}>
                  {trend.value >= 0 ? '+' : ''}{trend.value}%
                </span>
                {trend.label && (
                  <span className="text-muted-foreground">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn('p-2.5 rounded-xl bg-muted/50', statusColors[status])}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Progress Card Component
// ============================================

interface ProgressCardProps {
  title: string;
  value: number;
  max?: number;
  unit?: string;
  status?: 'success' | 'warning' | 'error' | 'neutral';
  showValue?: boolean;
  className?: string;
}

export function ProgressCard({ title, value, max = 100, unit = '%', status = 'neutral', showValue = true, className }: ProgressCardProps) {
  const progressColors = {
    success: '[&>div]:bg-[var(--success)]',
    warning: '[&>div]:bg-[var(--warning)]',
    error: '[&>div]:bg-[var(--destructive)]',
    neutral: '[&>div]:bg-primary',
  };

  const getStatusFromValue = (val: number): 'success' | 'warning' | 'error' => {
    if (val >= 80) return 'error';
    if (val >= 60) return 'warning';
    return 'success';
  };

  const actualStatus = status === 'neutral' ? getStatusFromValue(value) : status;

  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardContent className="pt-4 pb-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{title}</span>
            {showValue && (
              <span className={cn(
                'text-sm font-medium',
                actualStatus === 'error' ? 'text-[var(--destructive)]' :
                actualStatus === 'warning' ? 'text-[var(--warning)]' :
                'text-card-foreground'
              )}>
                {value.toFixed(1)}{unit}
              </span>
            )}
          </div>
          <Progress 
            value={value} 
            className={cn('h-2', progressColors[actualStatus])}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Activity List Component
// ============================================

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface ActivityListProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityList({ items, className }: ActivityListProps) {
  const typeStyles = {
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    error: 'bg-[var(--destructive)]',
    info: 'bg-[var(--info)]',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <span className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', typeStyles[item.type])} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-card-foreground">{item.title}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">{item.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Data Table Components
// ============================================

interface DataTableProps {
  headers: { key: string; label: string; className?: string }[];
  rows: Record<string, React.ReactNode>[];
  className?: string;
}

export function DataTable({ headers, rows, className }: DataTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {headers.map((header) => (
              <th
                key={header.key}
                className={cn(
                  'text-left py-3 px-4 text-sm font-medium text-muted-foreground',
                  header.className
                )}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/50 hover:bg-muted/30 transition-colors"
            >
              {headers.map((header) => (
                <td key={header.key} className={cn('py-3 px-4 text-sm', header.className)}>
                  {row[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Section Header Component
// ============================================

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ============================================
// Priority Badge Component
// ============================================

const priorityVariants = cva(
  'font-medium border',
  {
    variants: {
      priority: {
        low: 'bg-muted/50 text-muted-foreground border-muted',
        medium: 'bg-[var(--info)]/15 text-[var(--info)] border-[var(--info)]/30',
        high: 'bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30',
        critical: 'bg-[var(--destructive)]/15 text-[var(--destructive)] border-[var(--destructive)]/30',
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2 py-0.5',
      },
    },
    defaultVariants: {
      priority: 'medium',
      size: 'md',
    },
  }
);

interface PriorityBadgeProps extends VariantProps<typeof priorityVariants> {
  className?: string;
}

export function PriorityBadge({ priority, size, className }: PriorityBadgeProps) {
  return (
    <Badge variant="outline" className={cn(priorityVariants({ priority, size }), className)}>
      {priority}
    </Badge>
  );
}

// ============================================
// Tag Component
// ============================================

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Tag({ children, variant = 'default', size = 'md', className }: TagProps) {
  const variants = {
    default: 'bg-muted text-muted-foreground border-muted',
    primary: 'bg-primary/15 text-primary border-primary/30',
    success: 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30',
    warning: 'bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30',
    error: 'bg-[var(--destructive)]/15 text-[var(--destructive)] border-[var(--destructive)]/30',
    info: 'bg-[var(--info)]/15 text-[var(--info)] border-[var(--info)]/30',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-md border font-medium',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
}

// ============================================
// Empty State Component
// ============================================

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export {
  statusBadgeVariants,
  statusDotVariants,
  priorityVariants,
};
