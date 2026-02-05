import React, { useState } from "react";
import { Edit3 } from "lucide-react";

export default function EditChallengeModal({ challenge, difficulties, onSave, onClose }) {
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