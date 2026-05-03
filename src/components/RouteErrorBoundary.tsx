import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // If it's a chunk load error (dynamic import failure) due to a new deployment,
    // force a page reload to get the new bundles.
    const isChunkLoadError = 
      error?.name === "ChunkLoadError" ||
      error?.message?.includes("Failed to fetch dynamically imported module") ||
      error?.message?.includes("Importing a module script failed");

    if (isChunkLoadError) {
      // Prevent infinite reload loops by checking sessionStorage
      const reloadKey = "vmora_chunk_reload";
      const lastReload = sessionStorage.getItem(reloadKey);
      
      // Only reload if we haven't reloaded recently (e.g., within the last 10 seconds)
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem(reloadKey, now.toString());
        console.log("Chunk load error detected. Forcing reload to fetch new bundles.");
        window.location.reload();
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-light uppercase tracking-widest text-vmora-black mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            We encountered an unexpected error while loading this page. 
            Please refresh the page to try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-vmora-black text-white text-sm uppercase tracking-widest luxury-transition hover:bg-gray-800"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
