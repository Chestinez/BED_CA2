import React from "react";

export default function ContentLoadWrap({ children, isLoading }) {
  return (
    <div className="position-relative d-flex justify-content-center align-items-center m-5">
      {isLoading ? (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div
            className="loader-orb bg-primary rounded-circle"
            style={{ width: 30, height: 30 }}
          ></div>
          <p className="text-center mt-2 mb-0">Syncing Data...</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
