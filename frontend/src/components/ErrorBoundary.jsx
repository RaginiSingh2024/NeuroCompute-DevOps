import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--text)",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "50%",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <AlertTriangle size={48} color="#ef4444" />
          </div>
          <h1 style={{ fontSize: "28px", marginBottom: "10px", color: "var(--text-h)" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#64748b", marginBottom: "30px", maxWidth: "400px" }}>
            An unexpected error occurred. Please refresh the page or try again later.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-blue) 100%)",
              color: "#ffffff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s"
            }}
          >
            <RefreshCw size={16} />
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: "30px", textAlign: "left", maxWidth: "600px" }}>
              <summary style={{ cursor: "pointer", color: "#64748b", marginBottom: "10px" }}>
                Error Details (Development Only)
              </summary>
              <pre style={{
                background: "rgba(0, 0, 0, 0.3)",
                padding: "15px",
                borderRadius: "8px",
                fontSize: "12px",
                overflow: "auto",
                color: "#ef4444"
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
