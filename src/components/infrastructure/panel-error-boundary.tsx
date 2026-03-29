'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  className?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class PanelErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[PanelErrorBoundary]', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onRetry?.();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className={cn('border-[var(--destructive)]/50 bg-[var(--destructive)]/5', this.props.className)}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="rounded-full bg-[var(--destructive)]/10 p-3">
                <AlertTriangle className="h-6 w-6 text-[var(--destructive)]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">
                  {this.props.fallbackTitle || 'Section Error'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {this.state.error?.message || 'An unexpected error occurred in this panel.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.handleRetry}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => this.setState({ hasError: false })}
                  className="text-muted-foreground"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default PanelErrorBoundary;
