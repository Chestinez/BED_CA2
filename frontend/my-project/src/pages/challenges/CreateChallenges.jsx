// Create Challenge Page - Form to create new challenges
// Validates rewards based on difficulty level
import React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, Target, Award, CheckCircle } from "lucide-react";
import BackArrow from "../../components/backArrow/BackArrow";
import api from "../../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import ContentLoadWrap from "../../components/PageLoader/ContentLoadWrap";

export default function CreateChallenges() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [difficulties, setDifficulties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points_rewarded: 0,
    credits_rewarded: 0,
    duration_days: 1,
    difficulty_id: 1,
    is_active: "1",
  });

  // Fetch difficulties from API
  useEffect(() => {
    const fetchDifficulties = async () => {
      try {
        const response = await api.get("/difficulties");
        setDifficulties(response.data.results);
        // Set default difficulty_id to first difficulty
        if (response.data.results.length > 0) {
          setFormData((prev) => ({
            ...prev,
            difficulty_id: response.data.results[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching difficulties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDifficulties();
  }, []);

  const getCurrentDifficulty = () => {
    return (
      difficulties.find((d) => d.id == formData.difficulty_id) || {
        name: "Unknown",
        min_value: 0,
      }
    );
  };

  const validateRewards = () => {
    const totalRewards = parseInt(formData.points_rewarded || 0) + parseInt(formData.credits_rewarded || 0);
    const points = parseInt(formData.points_rewarded || 0);
    const credits = parseInt(formData.credits_rewarded || 0);
    const selectedDifficulty = getCurrentDifficulty();
    
    // Individual limits validation
    if (points >= 90) {
      setValidationError("Points cannot exceed 90");
      return false;
    }
    
    if (credits >= 60) {
      setValidationError("Credits cannot exceed 60");
      return false;
    }
    
    // Difficulty range validation
    let minRequired = 0;
    let maxAllowed = Infinity;
    
    if (selectedDifficulty.id == 1) { // Easy
      minRequired = 0;
      maxAllowed = 50;
    } else if (selectedDifficulty.id == 2) { // Medium
      minRequired = 51;
      maxAllowed = 100;
    } else if (selectedDifficulty.id == 3) { // Hard
      minRequired = 101;
      maxAllowed = Infinity;
    }
    
    if (totalRewards < minRequired) {
      setValidationError(
        `${selectedDifficulty.name} difficulty requires a minimum of ${minRequired} total points + credits. Current total: ${totalRewards}`
      );
      return false;
    }
    
    if (totalRewards > maxAllowed) {
      setValidationError(
        `${selectedDifficulty.name} difficulty allows a maximum of ${maxAllowed} total points + credits. Current total: ${totalRewards}. Consider using a higher difficulty.`
      );
      return false;
    }
    
    setValidationError("");
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear validation error when user makes changes
    if (validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate rewards before submitting
    if (!validateRewards()) {
      return;
    }

    try {
      const response = await api.post("/challenges/create", formData);
      setShowPopUp(true);
      setValidationError(""); // Clear any previous errors
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        points_rewarded: 0,
        credits_rewarded: 0,
        duration_days: 1,
        difficulty_id: difficulties.length > 0 ? difficulties[0].id : 1,
        is_active: "1",
      });
    } catch (err) {
      console.error("Error creating challenge:", err);
      console.error("Error response:", err.response?.data);
      
      // Show server validation errors
      const errorMessage = err.response?.data?.message || "Failed to create challenge. Please try again.";
      setValidationError(errorMessage);
    }
  };

  useEffect(() => {
    if (showPopUp) {
      setTimeout(() => {
        setShowPopUp(false);
      }, 3000);
    }
  }, [showPopUp]);

  return (
    <PageLoadWrap>
      <div className="container mt-5 text-white">
        {/* Validation Error */}
        {validationError && (
          <div
            className="alert alert-danger d-flex align-items-center mb-4"
            role="alert"
          >
            <Target size={20} className="me-2" />
            {validationError}
          </div>
        )}

        {/* Success Popup */}
        {showPopUp && (
          <div
            className="alert alert-success d-flex align-items-center"
            role="alert"
          >
            <CheckCircle size={20} className="me-2" />
            Challenge created successfully!
          </div>
        )}

        {/* Header with Back Arrow */}
        <BackArrow Title="CONSTRUCT YOUR CHALLENGE" />

        <form
          onSubmit={handleSubmit}
          className="bg-dark p-4 rounded border border-secondary"
        >
          <div className="row">
            {/* Left Column: Basic Info */}
            <div className="col-md-8">
              <div className="mb-3">
                <label className="form-label text-primary fw-bold small">
                  MISSION TITLE
                </label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="e.g., The Kessel Run..."
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-primary fw-bold small">
                  INTEL / DESCRIPTION
                </label>
                <textarea
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="What must the pilots achieve?"
                  required
                />
              </div>
            </div>

            {/* Right Column: Rewards & Config */}
            <div className="col-md-4">
              <div className="p-3 bg-black rounded border border-secondary mb-3">
                <h5 className="small text-muted mb-3">
                  <Award size={16} className="me-2" /> REWARDS
                </h5>
                <div className="mb-2">
                  <label className="small">Points</label>
                  <input
                    name="points_rewarded"
                    type="number"
                    value={formData.points_rewarded}
                    onChange={handleChange}
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    min="0"
                  />
                </div>
                <div className="mb-2">
                  <label className="small">Credits</label>
                  <input
                    name="credits_rewarded"
                    type="number"
                    value={formData.credits_rewarded}
                    onChange={handleChange}
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    min="0"
                  />
                </div>

                {/* Real-time total display */}
                <div className="mt-2 p-2 bg-secondary rounded">
                  <small className="text-light">
                    Total:{" "}
                    {parseInt(formData.points_rewarded || 0) +
                      parseInt(formData.credits_rewarded || 0)}
                    <span className="text-muted ms-2">
                      (Min for {getCurrentDifficulty().name}:{" "}
                      {getCurrentDifficulty().min_value})
                    </span>
                  </small>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-primary fw-bold">
                  <Target size={16} className="me-2" /> DIFFICULTY
                </label>
                <select
                  name="difficulty_id"
                  value={formData.difficulty_id}
                  onChange={handleChange}
                  className="form-select bg-dark text-white border-secondary"
                  disabled={loading}
                >
                  {loading ? (
                    <option>Loading difficulties...</option>
                  ) : (
                    difficulties.map((difficulty) => (
                      <option key={difficulty.id} value={difficulty.id}>
                        {difficulty.name} (Min: {difficulty.min_value} total)
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-primary fw-bold">
                  DURATION (DAYS)
                </label>
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
                <label className="form-label small text-primary fw-bold">
                  STATUS
                </label>
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

          <hr className="border-secondary mt-4" />

          {/* Create Button */}
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary px-5 py-2 fw-bold shadow-lg"
            >
              DEPLOY CHALLENGE
            </button>
          </div>
        </form>
      </div>
    </PageLoadWrap>
  );
}
