import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function CompletionModal({ 
  challenge, 
  isVisible, 
  onClose, 
  onComplete 
}) {
  const [completionNotes, setCompletionNotes] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  const handleSubmit = async () => {
    if (!completionNotes.trim()) {
      alert(
        "Please describe what you accomplished before completing the challenge.",
      );
      return;
    }

    try {
      setIsCompleting(true);
      await onComplete(challenge.challenge_id, completionNotes.trim());
      setCompletionNotes("");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleClose = () => {
    setCompletionNotes("");
    onClose();
  };

  if (!isVisible || !challenge) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white border border-secondary">
          <div className="modal-header border-secondary">
            <h5 className="modal-title d-flex align-items-center">
              <CheckCircle size={24} className="me-2 text-success" />
              Complete Challenge: {challenge.title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
              disabled={isCompleting}
            >
              <X size={16} />
            </button>
          </div>

          <div className="modal-body">
            {/* Challenge Info */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card bg-secondary bg-opacity-25 border-0">
                  <div className="card-body p-3">
                    <h6 className="text-primary mb-2">Challenge Details</h6>
                    <p className="small mb-2">
                      <strong>Description:</strong>{" "}
                      {challenge.description}
                    </p>
                    <p className="small mb-0">
                      <strong>Started:</strong>{" "}
                      {new Date(challenge.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card bg-success bg-opacity-25 border-0">
                  <div className="card-body p-3">
                    <h6 className="text-success mb-2">Rewards</h6>
                    <p className="small mb-1">
                      🏆{" "}
                      <strong>{challenge.points_rewarded}</strong>{" "}
                      Points
                    </p>
                    <p className="small mb-0">
                      💰{" "}
                      <strong>{challenge.credits_rewarded}</strong>{" "}
                      Credits
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Initial Notes */}
            {challenge.notes && (
              <div className="mb-4">
                <label className="form-label text-info">
                  <strong>Your Initial Approach:</strong>
                </label>
                <div className="p-3 bg-info bg-opacity-10 rounded border border-info border-opacity-25">
                  <p className="mb-0 small text-light-gray">
                    {challenge.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Completion Notes Input */}
            <div className="mb-3">
              <label className="form-label text-warning">
                <strong>Completion Report *</strong>
              </label>
              <p className="small text-muted mb-2">
                Describe what you accomplished, challenges you faced,
                results achieved, or lessons learned.
              </p>
              <textarea
                className="form-control bg-dark text-white border-warning"
                rows="6"
                placeholder="Example: I successfully completed the asteroid mining mission by navigating through the field using advanced scanning techniques. I collected 75 units of rare minerals (exceeding the 50 unit requirement) and discovered a new mineral deposit. The main challenge was avoiding the larger asteroids, but I managed to complete the mission 2 days ahead of schedule."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                disabled={isCompleting}
                style={{
                  resize: "vertical",
                  minHeight: "120px",
                }}
              />
              <div className="form-text text-muted">
                {completionNotes.length}/500 characters
              </div>
            </div>
          </div>

          <div className="modal-footer border-secondary">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isCompleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success px-4"
              onClick={handleSubmit}
              disabled={isCompleting || !completionNotes.trim()}
            >
              {isCompleting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="me-2" />
                  Complete Challenge
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}