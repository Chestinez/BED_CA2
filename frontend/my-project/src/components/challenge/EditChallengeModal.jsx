import React, { useState, useEffect } from "react";
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
  const [isValid, setIsValid] = useState(true);

  const getCurrentDifficulty = () => {
    return difficulties.find(d => d.id == formData.difficulty_id) || { name: "Unknown", min_value: 0 };
  };

  const validateRewards = (currentFormData = formData) => {
    const points = parseInt(currentFormData.points_rewarded || 0);
    const credits = parseInt(currentFormData.credits_rewarded || 0);
    const totalRewards = points + credits;
    const selectedDifficulty = difficulties.find(d => d.id == currentFormData.difficulty_id) || { name: "Unknown", min_value: 0 };
    
    console.log("Validating:", { points, credits, totalRewards, difficulty: selectedDifficulty.name });
    
    // Check individual limits first
    if (points >= 90) {
      setValidationError("❌ Points cannot exceed 90");
      setIsValid(false);
      return false;
    }
    
    if (credits >= 60) {
      setValidationError("❌ Credits cannot exceed 60");
      setIsValid(false);
      return false;
    }
    
    // Check difficulty range limits
    let maxAllowed = Infinity;
    let minRequired = 0;
    
    if (selectedDifficulty.id == 1) { // Easy
      minRequired = 0;
      maxAllowed = 50;
    } else if (selectedDifficulty.id == 2) { // Medium
      minRequired = 51;
      maxAllowed = 100;
    } else if (selectedDifficulty.id == 3) { // Hard
      minRequired = 101;
      maxAllowed = Infinity; // No upper limit for Hard
    }
    
    if (totalRewards > maxAllowed) {
      setValidationError(
        `❌ ${selectedDifficulty.name} difficulty allows a maximum of ${maxAllowed} total rewards. Current: ${totalRewards}. Consider using a higher difficulty.`
      );
      setIsValid(false);
      return false;
    }
    
    if (totalRewards < minRequired) {
      setValidationError(
        `❌ ${selectedDifficulty.name} difficulty requires a minimum of ${minRequired} total rewards. Current: ${totalRewards}. This challenge will be set to INACTIVE until fixed.`
      );
      setIsValid(false);
      return false;
    }
    
    setValidationError("");
    setIsValid(true);
    return true;
  };

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    
    setFormData(newFormData);
    
    // Validate immediately with the new form data
    validateRewards(newFormData);
  };

  // Validate on mount and when difficulties change
  useEffect(() => {
    if (difficulties.length > 0) {
      validateRewards();
    }
  }, [difficulties]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    
    // Final validation
    const isCurrentlyValid = validateRewards(formData);
    
    // If invalid, automatically set is_active to "0"
    const finalFormData = {
      ...formData,
      is_active: isCurrentlyValid ? formData.is_active : "0"
    };
    
    if (!isCurrentlyValid) {
      console.log("Challenge is invalid, setting to inactive");
    }
    
    onSave(finalFormData);
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
                <div className={`alert ${isValid ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {validationError}
                  {!isValid && (
                    <div className="mt-2 small">
                      <strong>Note:</strong> This challenge will be automatically set to INACTIVE if you save these values.
                    </div>
                  )}
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
                      className={`form-control bg-dark text-white ${!isValid ? 'border-danger' : 'border-secondary'}`}
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
                      className={`form-control bg-dark text-white ${!isValid ? 'border-danger' : 'border-secondary'}`}
                      min="0"
                    />
                  </div>
                  
                  {/* Real-time total display */}
                  <div className={`mb-3 p-2 rounded ${!isValid ? 'bg-danger bg-opacity-25 border border-danger' : 'bg-secondary'}`}>
                    <small className="text-light">
                      <strong>Total: {parseInt(formData.points_rewarded || 0) + parseInt(formData.credits_rewarded || 0)}</strong>
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
                      disabled={!isValid} // Disable if invalid - will be set to inactive automatically
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {!isValid && (
                      <small className="text-danger">
                        Status will be set to INACTIVE due to validation errors
                      </small>
                    )}
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
                className={`btn ${isValid ? 'btn-primary' : 'btn-warning'}`}
              >
                {isValid ? 'Save Changes' : 'Save as Inactive'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}