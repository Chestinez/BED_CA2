import React, { useState } from 'react';
import { Edit3, X } from 'lucide-react';

export default function EditProfileModal({ user, onSave, onClose }) {
  const [formData, setFormData] = useState({
    username: user.username || '',
    description: user.description || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white border border-secondary">
          <div className="modal-header border-secondary">
            <h5 className="modal-title">
              <Edit3 size={20} className="me-2" />
              Edit Profile
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={saving}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  minLength={3}
                  maxLength={20}
                />
                <small className="text-muted">3-20 characters</small>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Bio/Description</label>
                <textarea
                  className="form-control bg-dark text-white border-secondary"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={200}
                  placeholder="Tell us about yourself..."
                />
                <small className="text-muted">{formData.description.length}/200 characters</small>
              </div>
            </div>

            <div className="modal-footer border-secondary">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
