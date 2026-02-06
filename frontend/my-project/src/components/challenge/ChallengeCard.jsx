import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Edit3, Trash2, Eye, EyeOff } from "lucide-react";
import api from "../../services/api";
import Toast from "../Toast/Toast";
import { useAuth } from "../../hooks/useAuth";

export default function ChallengeCard({ challenge, onChallengeUpdate }) {
  const { user } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fix: user is an array, so we need to access user[0]
  const currentUser = user && localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData'))[0] : null;
  const isOwner = currentUser && challenge.creator_id && challenge.creator_id === currentUser.id;

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleToggleActive = async () => {
    try {
      const new_is_active = challenge.is_active === "1" ? "0" : "1";
      await api.put(`/challenges/update/${challenge.id}`, {
        ...challenge,
        is_active: new_is_active
      });
      
      if (onChallengeUpdate) {
        onChallengeUpdate(challenge.id, { ...challenge, is_active: new_is_active });
      }
      
      showToast(
        `Challenge ${new_is_active === "1" ? "activated" : "deactivated"} successfully`, 
        'success'
      );
    } catch (err) {
      console.error('Error toggling challenge status:', err);
      showToast('Failed to update challenge status', 'error');
    }
  };

  const handleDeleteChallenge = async () => {
    try {
      await api.delete(`/challenges/delete/${challenge.id}`);
      
      if (onChallengeUpdate) {
        onChallengeUpdate(challenge.id, null); // null indicates deletion
      }
      
      setShowDeleteModal(false);
      showToast('Challenge deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting challenge:', err);
      showToast('Failed to delete challenge', 'error');
    }
  };

  const handleStartChallenge = async () => {
    try {
      setIsStarting(true);
      await api.post(`/challenges/${challenge.id}/start`, {
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
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h3 className="text-white mb-0">{challenge.title}</h3>
              {isOwner && (
                <div className="dropdown">
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <MoreVertical size={16} />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <Link 
                        className="dropdown-item"
                        to="/challenges/profile"
                      >
                        <Edit3 size={16} className="me-2" />
                        Edit
                      </Link>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={handleToggleActive}
                      >
                        <EyeOff size={16} className="me-2" />
                        Deactivate
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <Trash2 size={16} className="me-2" />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
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
                className={`badge me-2 ${challenge.difficultyName === "Easy" ? "bg-success" : challenge.difficultyName === "Medium" ? "bg-warning text-black" : "bg-danger"}`}
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
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h3 className="alert alert-danger mb-0">{challenge.title} - Inactive</h3>
              {isOwner && (
                <div className="dropdown">
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <MoreVertical size={16} />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <Link 
                        className="dropdown-item"
                        to="/challenges/profile"
                      >
                        <Edit3 size={16} className="me-2" />
                        Edit
                      </Link>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={handleToggleActive}
                      >
                        <Eye size={16} className="me-2" />
                        Activate
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <Trash2 size={16} className="me-2" />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <p className="text-muted">This challenge is currently inactive.</p>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content bg-dark text-white">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title text-danger">
                    <Trash2 size={20} className="me-2" />
                    Delete Challenge
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete <strong>"{challenge.title}"</strong>?</p>
                  <p className="text-warning small">
                    <strong>Warning:</strong> This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer border-secondary">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={handleDeleteChallenge}
                  >
                    Delete Challenge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
