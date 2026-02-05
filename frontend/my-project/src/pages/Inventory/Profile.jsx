import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { CheckCircle, X } from "lucide-react";
import api from "../../services/api";
import ShipAssembly from "../../components/InventoryScene/ShipAssembly";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";

export default function Profile() {
  const { username } = useParams();
  const { user, refreshUserData } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  const isOwnProfile = !username || (user && user.username === username);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (username) {
          const response = await api.get(`/users/profile/${username}`);
          setProfileData(response.data.results[0]);
        } else {
          const response = await api.get("/users/profile/me");
          setProfileData(response.data.results[0]);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  useEffect(() => {
    if (isOwnProfile && user) {
      fetchPendingChallenges();
    }
  }, [isOwnProfile, user]);

  const fetchPendingChallenges = async () => {
    try {
      setLoadingChallenges(true);
      const response = await api.get("/completions/pending");
      setPendingChallenges(response.data.results || []);
    } catch (error) {
      console.error("Error fetching pending challenges:", error);
      setPendingChallenges([]);
    } finally {
      setLoadingChallenges(false);
    }
  };

  const handleCompleteChallenge = async (challengeId, notes) => {
    try {
      setIsCompleting(true);
      const response = await api.post(`/challenges/${challengeId}/complete`, {
        notes: notes,
      });

      // Remove completed challenge from list
      setPendingChallenges((prev) =>
        prev.filter((challenge) => challenge.challenge_id !== challengeId),
      );

      // Close modal and reset
      setShowCompletionModal(false);
      setSelectedChallenge(null);
      setCompletionNotes("");

      alert(
        `Challenge completed! You earned ${response.data.newTotalPoints} points and ${response.data.newTotalCredits} credits!`,
      );
      
      // Refresh user data to update dashboard stats
      await refreshUserData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to complete challenge";
      alert(errorMessage);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleAbandonChallenge = async (challengeId, challengeTitle) => {
    if (!confirm(`Are you sure you want to abandon "${challengeTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.post(`/challenges/${challengeId}/abandon`);
      
      // Remove abandoned challenge from list
      setPendingChallenges((prev) =>
        prev.filter((challenge) => challenge.challenge_id !== challengeId),
      );

      alert("Challenge abandoned successfully.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to abandon challenge";
      alert(errorMessage);
    }
  };

  const openCompletionModal = (challenge) => {
    setSelectedChallenge(challenge);
    setCompletionNotes("");
    setShowCompletionModal(true);
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
    setSelectedChallenge(null);
    setCompletionNotes("");
  };

  const handleSubmitCompletion = () => {
    if (!completionNotes.trim()) {
      alert(
        "Please describe what you accomplished before completing the challenge.",
      );
      return;
    }
    handleCompleteChallenge(
      selectedChallenge.challenge_id,
      completionNotes.trim(),
    );
  };

  if (loading) {
    return <PageLoadWrap />; // Just show the orb loader without text
  }

  if (error) {
    return (
      <PageLoadWrap>
        <div className="alert alert-danger">{error}</div>
      </PageLoadWrap>
    );
  }

  return (
    <PageLoadWrap>
      {/* Completion Modal */}
      {showCompletionModal && selectedChallenge && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title d-flex align-items-center">
                  <CheckCircle size={24} className="me-2 text-success" />
                  Complete Challenge: {selectedChallenge.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeCompletionModal}
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
                          {selectedChallenge.description}
                        </p>
                        <p className="small mb-0">
                          <strong>Started:</strong>{" "}
                          {new Date(
                            selectedChallenge.created_at,
                          ).toLocaleDateString()}
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
                          <strong>{selectedChallenge.points_rewarded}</strong>{" "}
                          Points
                        </p>
                        <p className="small mb-0">
                          💰{" "}
                          <strong>{selectedChallenge.credits_rewarded}</strong>{" "}
                          Credits
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Initial Notes */}
                {selectedChallenge.notes && (
                  <div className="mb-4">
                    <label className="form-label text-info">
                      <strong>Your Initial Approach:</strong>
                    </label>
                    <div className="p-3 bg-info bg-opacity-10 rounded border border-info border-opacity-25">
                      <p className="mb-0 small text-light-gray">
                        {selectedChallenge.notes}
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
                  onClick={closeCompletionModal}
                  disabled={isCompleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success px-4"
                  onClick={handleSubmitCompletion}
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
      )}

      <div className="container mt-4">
        <h1 className="text-white mb-4">
          {username ? `${username}'s Profile` : "My Profile"}
        </h1>

        {profileData && (
          <div className="text-white">
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card bg-dark border-secondary">
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      Profile Information
                    </h5>
                    <p>
                      <strong>Username:</strong> {profileData.username}
                    </p>
                    <p>
                      <strong>Rank:</strong>{" "}
                      <span className="badge bg-info">{profileData.rank}</span>
                    </p>
                    <p>
                      <strong>Points:</strong>{" "}
                      <span className="text-warning">{profileData.points}</span>
                    </p>
                    <p>
                      <strong>Credits:</strong>{" "}
                      <span className="text-success">
                        {profileData.credits}
                      </span>
                    </p>
                    <p>
                      <strong>Account Created:</strong>{" "}
                      {new Date(profileData.account_age).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card bg-dark border-secondary">
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      Mission Statistics
                    </h5>
                    <p>
                      <strong>Missions Completed:</strong>{" "}
                      <span className="text-success">
                        {profileData.missions_completed}
                      </span>
                    </p>
                    <p>
                      <strong>Missions Pending:</strong>{" "}
                      <span className="text-warning">
                        {profileData.missions_pending}
                      </span>
                    </p>
                    <p>
                      <strong>Total Missions:</strong>{" "}
                      <span className="text-info">
                        {profileData.missions_total}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-white mb-3">Ship Assembly</h3>
              <ShipAssembly profileData={profileData} />
            </div>

            {/* Pending Challenges - Only for own profile */}
            {isOwnProfile && (
              <div className="mt-4">
                <h3 className="text-white mb-3">
                  Pending Challenges ({pendingChallenges.length})
                </h3>
                {loadingChallenges ? (
                  <div className="d-flex justify-content-center align-items-center py-4">
                    <div
                      className="loader-orb bg-primary rounded-circle"
                      style={{ width: 30, height: 30 }}
                    ></div>
                  </div>
                ) : pendingChallenges.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <p>
                      No pending challenges. Start a new challenge to see it
                      here!
                    </p>
                  </div>
                ) : (
                  <div className="row">
                    {pendingChallenges.map((challenge) => (
                      <div
                        key={challenge.challenge_id}
                        className="col-md-6 mb-3"
                      >
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
                                {new Date(
                                  challenge.created_at,
                                ).toLocaleDateString()}
                              </div>
                            </div>

                            {challenge.notes && (
                              <div className="mb-2">
                                <small className="text-muted">
                                  Initial notes:
                                </small>
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
                                onClick={() => openCompletionModal(challenge)}
                              >
                                <CheckCircle size={16} className="me-1" />
                                Complete
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleAbandonChallenge(challenge.challenge_id, challenge.title)}
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
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLoadWrap>
  );
}
