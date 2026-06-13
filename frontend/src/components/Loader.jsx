import React from "react";

const Loader = ({ type = "spinner", message = "Initializing telemetry..." }) => {
  if (type === "skeleton") {
    return (
      <div className="jobs-grid" id="jobs-skeleton-grid">
        {[1, 2, 3].map((n) => (
          <div className="skeleton-card" key={n}>
            <div>
              <div className="skeleton-shimmer skeleton-title"></div>
              <div className="skeleton-shimmer skeleton-subtitle"></div>
              <div className="skeleton-shimmer skeleton-text"></div>
              <div className="skeleton-shimmer skeleton-text" style={{ width: "80%" }}></div>
              <div className="skeleton-shimmer skeleton-text-short"></div>
            </div>
            <div className="skeleton-footer">
              <div className="skeleton-shimmer skeleton-footer-left"></div>
              <div className="skeleton-shimmer skeleton-footer-right"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="loader-container" id="loading-spinner">
      <div className="spinner"></div>
      <p className="loader-text">{message}</p>
    </div>
  );
};

export default Loader;
