import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteAccountModal({ onConfirm, onClose }) {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const canDelete = password.length > 0 && confirmText === 'DELETE';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canDelete) return;

    setDeleting(true);
    try {
      await onConfirm(password);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white border border-danger">
          <div className="modal-header border-danger">
            <h5 className="modal-title text-danger">
              <Trash2 size={20} className="me-2" />
              Delete Account
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={deleting}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Warning */}
              <div className="alert alert-danger d-flex align-items-start">
                <AlertTriangle size={24} className="me-2 flex-shrink-0" />
                <div>
                  <strong>Warning: This action cannot be undone!</strong>
                  <p className="mb-0 mt-1">
                    All your data including challenges, progress, and ship parts will be permanently deleted.
                  </p>
                </div>
              </div>

              {/* Password Confirmation */}
              <div className="mb-3">
                <label className="form-label">Enter your password to confirm</label>
                <input
                  type="password"
                  className="form-control bg-dark text-white border-danger"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  disabled={deleting}
                />
              </div>

              {/* Type DELETE Confirmation */}
              <div className="mb-3">
                <label className="form-label">Type <code className="text-danger">DELETE</code> to confirm</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-danger"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  required
                  disabled={deleting}
                />
              </div>
            </div>

            <div className="modal-footer border-danger">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-danger"
                disabled={!canDelete || deleting}
              >
                {deleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="me-2" />
                    Delete My Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
