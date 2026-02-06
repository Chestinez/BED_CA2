import React from "react";
import { ArrowLeft } from "lucide-react";

// back arrow that directs users to previous page
// used for most pages other than dashboard
export default function BackArrow({ Title }) {
  return (
    <div className="d-flex align-items-center mb-4">
      <button
        className="btn btn-outline-secondary me-3"
        onClick={() => window.history.back()}
      >
        <ArrowLeft size={20} />
      </button>
      <h1 className="h2 mb-0">{Title}</h1>
    </div>
  );
}
