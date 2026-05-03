import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex h-full w-full flex-col items-center justify-center bg-secondary/10 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Preview Unavailable</p>
          <p className="mt-2 text-[10px] text-muted-foreground/70">The 3D model file could not be loaded or is private.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
