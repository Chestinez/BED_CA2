import React, { useState, useEffect } from "react";
import { MoreVertical, Edit3, Trash2, Eye, EyeOff, Plus, Target, Award, Calendar, User } from "lucide-react";
import api from "../../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import { Link } from "react-router-dom";

export default function ChallengeProfile() {
  const [challenges, setChallenges] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchUserChallenges();
    fetchDifficulties();
  }, []);

  const fetchUserChallenges = async () => {
    try {
      const response = await api.get("/challenges/selectAllByCreatorId");
      setChallenges(response.data.results);
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      showNotification("Failed to load challenges", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDifficulties = async () => {
    try {
      const response = await api.get("/difficulties");
      setDifficulties(response.data.results);
    } catch (error) {
      console.error("Error fetching difficulties:", error);
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleToggleActive = async (challengeId, currentStatus) => {
    try {
      const newStatus = currentStatus === "1" ? "0" : "1";
      const challenge = challenges.find(c => c.id === challengeId);
      
      await api.put(`/challenges/update/${challengeId}`, {
        ...challenge,
        is_active: newStatus
      });
      
      setChallenges(challenges.map(c => 
        c.id === challengeId ? { ...c, is_active: newStatus } : c
      ));
      
      showNotification(
        `Challenge ${newStatus === "1" ? "activated" : "deactivated"} successfully`, 
        "success"
      );
    } catch (error) {
      console.error("Error toggling challenge status:", error);
      showNotification("Failed to update challenge status", "error");
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    try {
      await api.delete(`/challenges/delete/${challengeId}`);
      setChallenges(challenges.filter(c => c.id !== challengeId));
      setShowDeleteModal(null);
      showNotification("Challenge deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting challenge:", error);
      showNotification("Failed to delete challenge", "error");
    }
  };

  const handleEditChallenge = async (challengeData) => {
    try {
      const response = await api.put(`/challenges/update/${challengeData.id}`, challengeData);
      console.log("Update response:", response.data);
      
      // Refresh the challenges list to get updated data with difficulty names
      await fetchUserChallenges();
      
      setEditingChallenge(null);
      showNotification("Challenge updated successfully", "success");
    } catch (error) {
      console.error("Error updating challenge:", error);
      const errorMessage = error.response?.data?.message || "Failed to update challenge";
      showNotification(errorMessage, "error");
    }
  };

  const getDifficultyName = (difficultyId) => {
    const difficulty = difficulties.find(d => d.id === difficultyId);
    return difficulty ? difficulty.name : "Unknown";
  };

  if (loading) {
    return <PageLoadWrap><div className="text-center text-white">Loading your challenges...</div></PageLoadWrap>;
  }

  return (
    <PageLoadWrap>
      <div className="container mt-5 text-white">
        {/* Notification */}
        {notification.show && (
          <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} mb-4`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 mb-0">
            <Target size={28} className="me-2" />
            My Challenge Arsenal
          </h1>
          <Link to="/challenges/create" className="btn btn-primary">
            <Plus size={20} className="me-2" />
            Create New Challenge
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-dark border-secondary">
              <div className="card-body text-center">
                <h5 className="text-primary">{challenges.length}</h5>
                <small className="text-muted">Total Challenges</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-dark border-secondary">
              <div className="card-body text-center">
                <h5 className="text-success">{challenges.filter(c => c.is_active === "1").length}</h5>
                <small className="text-muted">Active</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-dark border-secondary">
              <div className="card-body text-center">
                <h5 className="text-warning">{challenges.filter(c => c.is_active === "0").length}</h5>
                <small className="text-muted">Inactive</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-dark border-secondary">
              <div className="card-body text-center">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-warning mb-0">
                      {challenges.reduce((sum, c) => sum + (c.points_rewarded || 0), 0)}
                    </h6>
                    <small className="text-muted">Points</small>
                  </div>
                  <div>
                    <h6 className="text-info mb-0">
                      {challenges.reduce((sum, c) => sum + (c.credits_rewarded || 0), 0)}
                    </h6>
                    <small className="text-muted">Credits</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        {challenges.length === 0 ? (
          <div className="text-center py-5">
            <Target size={64} className="text-muted mb-3" />
            <h4 className="text-muted">No Challenges Created</h4>
            <p className="text-muted">Start building your challenge empire!</p>
            <Link to="/challenges/create" className="btn btn-primary">
              Create Your First Challenge
            </Link>
          </div>
        ) : (
          <div className="row">
            {challenges.map(challenge => (
              <div key={challenge.id} className="col-md-6 col-lg-4 mb-4">
                <div className={`card h-100 ${challenge.is_active === "1" ? "bg-dark border-success" : "bg-secondary border-warning"}`}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span className={`badge ${challenge.is_active === "1" ? "bg-success" : "bg-warning text-dark"}`}>
                      {challenge.is_active === "1" ? "Active" : "Inactive"}
                    </span>
                    <div className="dropdown">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        data-bs-toggle="dropdown"
                      >
                        <MoreVertical size={16} />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-dark">
                        <li>
                          <button 
                            className="dropdown-item"
                            onClick={() => setEditingChallenge(challenge)}
                          >
                            <Edit3 size={16} className="me-2" />
                            Edit
                          </button>
                        </li>
                        <li>
                          <button 
                            className="dropdown-item"
                            onClick={() => handleToggleActive(challenge.id, challenge.is_active)}
                          >
                            {challenge.is_active === "1" ? (
                              <>
                                <EyeOff size={16} className="me-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Eye size={16} className="me-2" />
                                Activate
                              </>
                            )}
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button 
                            className="dropdown-item text-danger"
                            onClick={() => setShowDeleteModal(challenge)}
                          >
                            <Trash2 size={16} className="me-2" />
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{challenge.title}</h5>
                    <p className="card-text text-muted small">
                      {challenge.description?.substring(0, 100)}
                      {challenge.description?.length > 100 && "..."}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary">
                        {getDifficultyName(challenge.difficulty_id)}
                      </span>
                      <small className="text-muted">
                        <Calendar size={14} className="me-1" />
                        {challenge.duration_days} day{challenge.duration_days !== 1 ? 's' : ''}
                      </small>
                    </div>
                    
                    <div className="d-flex justify-content-between">
                      <span className="text-warning">
                        <Award size={16} className="me-1" />
                        {challenge.points_rewarded || 0} pts
                      </span>
                      <span className="text-info">
                        💰 {challenge.credits_rewarded || 0} credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingChallenge && (
          <EditChallengeModal
            challenge={editingChallenge}
            difficulties={difficulties}
            onSave={handleEditChallenge}
            onClose={() => setEditingChallenge(null)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <DeleteConfirmationModal
            challenge={showDeleteModal}
            onConfirm={() => handleDeleteChallenge(showDeleteModal.id)}
            onCancel={() => setShowDeleteModal(null)}
          />
        )}
      </div>
    </PageLoadWrap>
  );
}

// Edit Challenge Modal Component
function EditChallengeModal({ challenge, difficulties, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description || "",
    points_rewarded: challenge.points_rewarded || 0,
    credits_rewarded: challenge.credits_rewarded || 0,
    duration_days: challenge.duration_days || 1,
    difficulty_id: challenge.difficulty_id,
    is_active: challenge.is_active
  });
  const [validationError, setValidationError] = useState("");

  const getCurrentDifficulty = () => {
    return difficulties.find(d => d.id == formData.difficulty_id) || { name: "Unknown", min_value: 0 };
  };

  const validateRewards = () => {
    const totalRewards = parseInt(formData.points_rewarded) + parseInt(formData.credits_rewarded);
    const selectedDifficulty = getCurrentDifficulty();
    
    if (totalRewards < selectedDifficulty.min_value) {
      setValidationError(
        `${selectedDifficulty.name} difficulty requires a minimum total of ${selectedDifficulty.min_value} points + credits. Current total: ${totalRewards}`
      );
      return false;
    }
    
    setValidationError("");
    return true;
  };

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    
    setFormData(newFormData);
    
    // Trigger validation after state update
    setTimeout(() => {
      validateRewards();
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    console.log("Validation check result:", validateRewards());
    
    // Validate rewards before submitting
    if (!validateRewards()) {
      console.log("Validation failed, not submitting");
      return;
    }
    
    console.log("Validation passed, submitting");
    onSave(formData);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header border-secondary">
            <h5 className="modal-title">
              <Edit3 size={20} className="me-2" />
              Edit Challenge
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Validation Error */}
              {validationError && (
                <div className="alert alert-danger mb-3">
                  {validationError}
                </div>
              )}
              
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Points</label>
                    <input
                      name="points_rewarded"
                      type="number"
                      value={formData.points_rewarded}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      min="0"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Credits</label>
                    <input
                      name="credits_rewarded"
                      type="number"
                      value={formData.credits_rewarded}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      min="0"
                    />
                  </div>
                  
                  {/* Real-time total display */}
                  <div className="mb-3 p-2 bg-secondary rounded">
                    <small className="text-light">
                      Total: {parseInt(formData.points_rewarded || 0) + parseInt(formData.credits_rewarded || 0)} 
                      <span className="text-muted d-block">
                        Min for {getCurrentDifficulty().name}: {getCurrentDifficulty().min_value}
                      </span>
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Difficulty</label>
                    <select
                      name="difficulty_id"
                      value={formData.difficulty_id}
                      onChange={handleChange}
                      className="form-select bg-dark text-white border-secondary"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty.id} value={difficulty.id}>
                          {difficulty.name} (Min: {difficulty.min_value})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration (Days)</label>
                    <input
                      name="duration_days"
                      type="number"
                      value={formData.duration_days}
                      onChange={handleChange}
                      className="form-control bg-dark text-white border-secondary"
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="is_active"
                      value={formData.is_active}
                      onChange={handleChange}
                      className="form-select bg-dark text-white border-secondary"
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={validationError}
              >
                {validationError ? "Fix Validation Errors" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ challenge, onConfirm, onCancel }) {
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