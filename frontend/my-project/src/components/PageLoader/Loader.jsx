import React from 'react';
// Simple full-page loader component
// Used for early returns when page is loading data
export default function Loader() {
  return (
    <div className="position-relative min-vh-100 bg-dark">
      <div className="loader-wrapper position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark">
        <div className="loader-orb bg-primary rounded-circle" style={{ width: 50, height: 50 }}></div>
      </div>
    </div>
  );
}
