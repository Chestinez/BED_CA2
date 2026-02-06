import React from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function PendingChallenges({ 
  challenges, 
  loading, 
  onComplete, 
  onAbandon 
}) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <div
          className="loader-orb bg-primary rounded-circle"
          style={{ width: 30, height: 30 }}
        ></div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <p>
          No pending challenges. Start a new challenge to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="row">
      {challenges.map((challenge) => (
        <div key={challenge.challenge_id} className="col-md-6 mb-3">
          <div className="card bg-dark border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="card-title text-white">
                  {challenge.title}
                </h6>
                <span className="badge bg-warning text-black">
                  Pending
                </span>
              </div>

              <p className="card-text text-muted small mb-2">
                {challenge.description}
              </p>

              <div className="mb-2">
                <small className="text-muted">Started:</small>
                <div className="text-info">
                  {new Date(challenge.created_at).toLocaleDateString()}
                </div>
              </div>

              {challenge.notes && (
                <div className="mb-2">
                  <small className="text-muted">Initial notes:</small>
                  <div className="text-secondary small">
                    {challenge.notes}
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className="text-warning small">
                    {challenge.points_rewarded} pts
                  </span>
                  <span className="text-success small ms-2">
                    {challenge.credits_rewarded} credits
                  </span>
                </div>
                <span
                  className={`badge ${
                    challenge.difficultyName === "Easy"
                      ? "bg-success"
                      : challenge.difficultyName === "Medium"
                        ? "bg-warning text-black"
                        : "bg-danger"
                  }`}
                >
                  {challenge.difficultyName}
                </span>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm flex-fill"
                  onClick={() => onComplete(challenge)}
                >
                  <CheckCircle size={16} className="me-1" />
                  Complete
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onAbandon(challenge.challenge_id, challenge.title)}
                  title="Abandon Challenge"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}