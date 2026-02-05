import React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, Target, Award, CheckCircle } from "lucide-react";
import api from "../../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";

export default function CreateChallenges() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points_rewarded: 0,
    credits_rewarded: 0,
    duration_days: 1,
    difficulty_id: 1,
    is_active: "1",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/challenges", formData);
      setShowPopUp(true);
      // Reset form
      setFormData({
        title: "",
        description: "",
        points_rewarded: 0,
        credits_rewarded: 0,
        duration_days: 1,
        difficulty_id: 1,
        is_active: "1",
      });
    } catch (err) {
      console.error(err);
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
        {/* Success Popup */}
        {showPopUp && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <CheckCircle size={20} className="me-2" />
            Challenge created successfully!
          </div>
        )}

        {/* Header with Back Arrow */}
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-outline-secondary me-3"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="h2 mb-0">
            Construct New Challenge
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark p-4 rounded border border-secondary">
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
                >
                  <option value="1">Easy (Rank 1)</option>
                  <option value="2">Medium (Rank 2)</option>
                  <option value="3">Hard (Rank 3)</option>
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
