import React from "react";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmationModal({ challenge, onConfirm, onCancel }) {
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header border-secondary">
            <h5 className="modal-title text-danger">
              <Trash2 size={20} className="me-2" />
              Delete Challenge
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete <strong>"{challenge.title}"</strong>?</p>
            <p className="text-warning small">
              <strong>Warning:</strong> This action cannot be undone. All associated completions will also be removed.
            </p>
          </div>
          <div className="modal-footer border-secondary">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Delete Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}