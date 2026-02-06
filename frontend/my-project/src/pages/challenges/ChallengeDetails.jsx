import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trophy, Clock, User } from "lucide-react";
import BackArrow from "../../components/backArrow/BackArrow";
import api from "../../services/api";
import Loader from "../../components/PageLoader/Loader";

export default function ChallengeDetails() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/challenges/selectById/${id}`);
        setChallenge(response.data.results[0]);
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError(err.response?.data?.message || "Failed to load challenge");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChallenge();
    }
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/challenges" className="btn btn-secondary">
          <ArrowLeft size={16} className="me-2" />
          Back to Challenges
        </Link>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Challenge not found</div>
        <Link to="/challenges" className="btn btn-secondary">
          <ArrowLeft size={16} className="me-2" />
          Back to Challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
        {/* Header */}
        <BackArrow Title="Challenge Details" />

        {/* Challenge Info */}
        <div className="row">
          <div className="col-lg-8">
            <div className="card bg-dark border-secondary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h2 className="text-white">{challenge.title}</h2>
                  <span
                    className={`badge ${
                      challenge.is_active === "1"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {challenge.is_active === "1" ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-muted mb-4">
                  {challenge.description || "No description provided."}
                </p>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 className="text-primary mb-3">Rewards</h5>
                    <p className="mb-2">
                      <Trophy size={16} className="me-2 text-warning" />
                      <strong>Points:</strong>{" "}
                      <span className="text-warning">
                        {challenge.points_rewarded}
                      </span>
                    </p>
                    <p className="mb-2">
                      <span className="me-2">💰</span>
                      <strong>Credits:</strong>{" "}
                      <span className="text-success">
                        {challenge.credits_rewarded}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h5 className="text-primary mb-3">Details</h5>
                    <p className="mb-2">
                      <Clock size={16} className="me-2 text-info" />
                      <strong>Duration:</strong>{" "}
                      <span className="text-info">
                        {challenge.duration_days} days
                      </span>
                    </p>
                    <p className="mb-2">
                      <User size={16} className="me-2 text-secondary" />
                      <strong>Created:</strong>{" "}
                      <span className="text-secondary">
                        {new Date(challenge.created_at).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card bg-dark border-secondary">
              <div className="card-body text-center">
                <h5 className="text-primary mb-3">Ready to Start?</h5>
                <p className="text-muted mb-4">
                  Take on this challenge and earn rewards!
                </p>

                {challenge.is_active === "1" ? (
                  <div>
                    <button
                      className="btn btn-primary btn-lg w-100 mb-3"
                      onClick={() => {
                        // Simple start challenge
                        api
                          .post(`/challenges/${challenge.id}/start`, {
                            notes: `Started challenge: ${challenge.title}`,
                          })
                          .then(() => {
                            alert(
                              "Challenge started! Check your profile to track progress.",
                            );
                          })
                          .catch((err) => {
                            alert(
                              err.response?.data?.message ||
                                "Failed to start challenge",
                            );
                          });
                      }}
                    >
                      Start Challenge
                    </button>
                    <Link
                      to="/challenges"
                      className="btn btn-outline-secondary w-100"
                    >
                      Back to Challenges
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-warning mb-3">
                      This challenge is currently inactive.
                    </p>
                    <Link
                      to="/challenges"
                      className="btn btn-outline-secondary w-100"
                    >
                      Back to Challenges
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
