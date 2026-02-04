import React from "react";

export default function ContentLoadWrap({ children, isLoading }) {
  return (
    <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center">
      {isLoading ? (
        <>
          <div className="loader-orb"></div>
          <p>Syncing Data...</p>
        </>
      ) : (
        children
      )}
    </div>
  );
}
