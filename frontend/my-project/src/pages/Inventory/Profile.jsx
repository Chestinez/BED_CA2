import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import ShipAssembly from "../../components/InventoryScene/ShipAssembly";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";

export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);

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
      const response = await api.get('/completions/pending');
      setPendingChallenges(response.data.results || []);
    } catch (error) {
      console.error('Error fetching pending challenges:', error);
      setPendingChallenges([]);
    } finally {
      setLoadingChallenges(false);
    }
  };

  const handleCompleteChallenge = async (challengeId, notes) => {
    try {
      const response = await api.post(`/challenges/${challengeId}/complete`, {
        notes: notes
      });
      
      // Remove completed challenge from list
      setPendingChallenges(prev => 
        prev.filter(challenge => challenge.challenge_id !== challengeId)
      );
      
      alert(`Challenge completed! You earned ${response.data.newTotalPoints} points and ${response.data.newTotalCredits} credits!`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to complete challenge';
      alert(errorMessage);
    }
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
                    <h5 className="card-title text-primary">Profile Information</h5>
                    <p><strong>Username:</strong> {profileData.username}</p>
                    <p><strong>Rank:</strong> <span className="badge bg-info">{profileData.rank}</span></p>
                    <p><strong>Points:</strong> <span className="text-warning">{profileData.points}</span></p>
                    <p><strong>Credits:</strong> <span className="text-success">{profileData.credits}</span></p>
                    <p><strong>Account Created:</strong> {new Date(profileData.account_age).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card bg-dark border-secondary">
                  <div className="card-body">
                    <h5 className="card-title text-primary">Mission Statistics</h5>
                    <p><strong>Missions Completed:</strong> <span className="text-success">{profileData.missions_completed}</span></p>
                    <p><strong>Missions Pending:</strong> <span className="text-warning">{profileData.missions_pending}</span></p>
                    <p><strong>Total Missions:</strong> <span className="text-info">{profileData.missions_total}</span></p>
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
                <h3 className="text-white mb-3">Pending Challenges ({pendingChallenges.length})</h3>
                {loadingChallenges ? (
                  <div className="d-flex justify-content-center align-items-center py-4">
                    <div className="loader-orb bg-primary rounded-circle" style={{ width: 30, height: 30 }}></div>
                  </div>
                ) : pendingChallenges.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <p>No pending challenges. Start a new challenge to see it here!</p>
                  </div>
                ) : (
                  <div className="row">
                    {pendingChallenges.map((challenge) => (
                      <div key={challenge.challenge_id} className="col-md-6 mb-3">
                        <div className="card bg-dark border-warning">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="card-title text-white">{challenge.title}</h6>
                              <span className="badge bg-warning text-dark">Pending</span>
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
                              <span className={`badge ${
                                challenge.difficultyName === "Easy" ? "bg-success" : 
                                challenge.difficultyName === "Medium" ? "bg-warning text-dark" : "bg-danger"
                              }`}>
                                {challenge.difficultyName}
                              </span>
                            </div>
                            
                            <button 
                              className="btn btn-success btn-sm w-100"
                              onClick={() => {
                                const completionNotes = prompt(`Complete Challenge: ${challenge.title}\n\nDescribe what you accomplished:`);
                                if (completionNotes && completionNotes.trim()) {
                                  handleCompleteChallenge(challenge.challenge_id, completionNotes.trim());
                                }
                              }}
                            >
                              Complete Challenge
                            </button>
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