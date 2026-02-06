// Content section loader - shows loader for specific content areas
// Use isLoading prop to control when to show loader vs content
import React from "react";

export default function ContentLoadWrap({ children, isLoading }) {
  return (
    <div className="position-relative d-flex justify-content-center align-items-center m-5">
      {isLoading ? (
        // Show loader while loading
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div
            className="loader-orb bg-primary rounded-circle"
            style={{ width: 30, height: 30 }}
          ></div>
          <p className="text-center mt-2 mb-0">Syncing Data...</p>
        </div>
      ) : (
        // Show content when done loading
        children
      )}
    </div>
  );
}
