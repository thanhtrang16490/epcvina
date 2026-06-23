import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors in child components and displays a fallback UI.
 * Prevents the entire app from crashing when one component fails.
 * 
 * Usage:
 * <ErrorBoundary name="FAQPage">
 *   <FAQPage />
 * </ErrorBoundary>
 * 
 * Or with custom fallback:
 * <ErrorBoundary 
 *   name="ProductList"
 *   fallback={<CustomFallback />}
 * >
 *   <ProductList />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to analytics/service
    console.error(`[ErrorBoundary: ${this.props.name || 'unknown'}]`, error, errorInfo);
    
    // Optional: Send to error tracking service
    // if (typeof window !== 'undefined' && window.gtag) {
    //   window.gtag('event', 'exception', {
    //     description: `${this.props.name}: ${error.message}`,
    //     fatal: false,
    //   });
    // }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[200px] flex items-center justify-center p-6 bg-red-50 rounded-xl border border-red-200">
          <div className="max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              {this.props.name 
                ? `Thành phần "${this.props.name}" gặp sự cố. ` 
                : 'Thành phần này gặp sự cố. '}
              Vui lòng thử lại hoặc quay lại trang chủ.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left bg-white p-3 rounded-lg text-xs font-mono overflow-auto max-h-32">
                <summary className="cursor-pointer text-gray-700 font-semibold mb-2">
                  Chi tiết lỗi (Development)
                </summary>
                <p className="text-red-600">{this.state.error.message}</p>
                <pre className="mt-2 text-gray-600 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                Trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
