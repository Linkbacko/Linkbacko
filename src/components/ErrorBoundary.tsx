import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LinkPulse AI Uncaught Error in Component Tree:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('linkpulse_accounts_v1');
      localStorage.removeItem('linkpulse_active_account_id_v1');
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-white">
                प्रिव्यू पुनः लोड करें (Reload Preview)
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                एप्लिकेशन स्टेट रीफ्रेश करने के लिए नीचे दिए गए बटन पर क्लिक करें।
              </p>
              {this.state.error && (
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-24">
                  {this.state.error.message || String(this.state.error)}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>पुनः लोड करें (Reload)</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>डेटा रीसेट करें (Reset Demo)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
