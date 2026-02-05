import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Toast from "../Toast/Toast";

export default function ChallengeCard({ challenge }) {
  const [isStarting, setIsStarting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleStartChallenge = async () => {
    try {
      setIsStarting(true);
      const response = await api.post(`/challenges/${challenge.id}/start`, {
        notes: `Started challenge: ${challenge.title}`
      });
      
      showToast(`Challenge "${challenge.title}" started! Check your profile to track progress.`, 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to start challenge';
      showToast(errorMessage, 'error');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <>
      <Toast 
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div
        className={`challenge-card ${String(challenge.is_active) === "0" ? "opacity-50" : ""} mb-4 p-3 border rounded bg-dark text-white border-secondary`}
      >
        {String(challenge.is_active) === "1" ? (
          <>
            <h3 className="text-white">{challenge.title}</h3>
            <p className="text-muted">{challenge.description}</p>
            <div className="row mb-3">
              <div className="col-md-6">
                <p className="mb-1"><strong>Points:</strong> <span className="text-warning">{challenge.points_rewarded}</span></p>
                <p className="mb-1"><strong>Credits:</strong> <span className="text-success">{challenge.credits_rewarded}</span></p>
              </div>
              <div className="col-md-6">
                <p className="mb-1"><strong>Duration:</strong> <span className="text-info">{challenge.duration_days} days</span></p>
                <p className="mb-1"><strong>By:</strong> <span className="text-secondary">{challenge.creatorName}</span></p>
              </div>
            </div>
            <div className="mb-3">
              <span
                className={`badge me-2 ${challenge.difficultyName === "Easy" ? "bg-success" : challenge.difficultyName === "Medium" ? "bg-warning text-dark" : "bg-danger"}`}
              >
                Difficulty: {challenge.difficultyName}
              </span>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={handleStartChallenge}
                disabled={isStarting}
              >
                {isStarting ? 'Starting...' : 'Start Challenge'}
              </button>
              <Link to={`/challenges/${challenge.id}`} className="btn btn-outline-info">
                View Details
              </Link>
            </div>
          </>
        ) : (
          <>
            <h3 className="alert alert-danger">{challenge.title} - Inactive</h3>
            <p className="text-muted">This challenge is currently inactive.</p>
          </>
        )}
      </div>
    </>
  );
}
