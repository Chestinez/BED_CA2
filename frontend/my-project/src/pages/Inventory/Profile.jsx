import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Edit3, Trash2 } from "lucide-react";
import api from "../../services/api";
import ShipAssembly from "../../components/InventoryScene/ShipAssembly";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import BackArrow from "../../components/backArrow/BackArrow";
import {
  ProfileHeader,
  CompletionModal,
  PendingChallenges,
  EditProfileModal,
  DeleteAccountModal,
} from "../../components/profile";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Edit/Delete modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

      alert(
        `Challenge completed! You earned ${response.data.newTotalPoints} points and ${response.data.newTotalCredits} credits!`,
      );

      // Refresh user data to update dashboard stats
      await refreshUserData();
    } catch (error) {
      console.error(
        error.response?.data?.message || "Failed to complete challenge",
      );
      alert(error.response?.data?.message || "Failed to complete challenge");
    }
  };

  const handleAbandonChallenge = async (challengeId, challengeTitle) => {
    if (
      !confirm(
        `Are you sure you want to abandon "${challengeTitle}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await api.post(`/challenges/${challengeId}/abandon`);

      // Remove abandoned challenge from list
      setPendingChallenges((prev) =>
        prev.filter((challenge) => challenge.challenge_id !== challengeId),
      );

      alert("Challenge abandoned successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to abandon challenge");
    }
  };

  const handleDeleteUser = async (password) => {
    try {
      await api.delete("/users/delete", {
        data: { password } // Send password in request body
      });
      
      alert("Account deleted successfully. You will be logged out.");
      
      // Logout and redirect
      await api.get("/users/logout");
      localStorage.removeItem("userData");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete account";
      alert(errorMessage);
      throw error; // Re-throw so modal knows it failed
    }
  };

  const handleEditProfile = async (formData) => {
    try {
      await api.put("/users/update", formData);
      
      // Refresh user data
      await refreshUserData();
      
      // Refresh profile data
      const response = await api.get("/users/profile/me");
      setProfileData(response.data.results[0]);
      
      setShowEditModal(false);
      alert("Profile updated successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      alert(errorMessage);
      throw error; // Re-throw so modal knows it failed
    }
  };

  const openCompletionModal = (challenge) => {
    setSelectedChallenge(challenge);
    setShowCompletionModal(true);
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
    setSelectedChallenge(null);
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
      <CompletionModal
        challenge={selectedChallenge}
        isVisible={showCompletionModal}
        onClose={closeCompletionModal}
        onComplete={handleCompleteChallenge}
      />

      {/* Edit Profile Modal */}
      {showEditModal && user && (
        <EditProfileModal
          user={user}
          onSave={handleEditProfile}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          onConfirm={handleDeleteUser}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-white mb-0">
            {username ? `${username}'s Profile` : "My Profile"}
          </h1>
          
          {/* Edit/Delete buttons - only show on own profile */}
          {isOwnProfile && (
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={() => setShowEditModal(true)}
              >
                <Edit3 size={16} className="me-2" />
                Edit Profile
              </button>
              <button 
                className="btn btn-outline-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={16} className="me-2" />
                Delete Account
              </button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        {profileData && (
          <ProfileHeader profileData={profileData} username={username} />
        )}
      </div>

      {/* Ship Assembly - Full Width Section */}
      {profileData && (
        <div className="container-fluid mt-4 px-4">
          <h3 className="text-white mb-3 text-center">Ship Assembly</h3>
          <div className="d-flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "1000px" }}>
              <ShipAssembly profileData={profileData} />
            </div>
          </div>
        </div>
      )}

      {/* Back to container for other content */}
      <div className="container mt-4">
        {/* Pending Challenges - Only for own profile */}
        {isOwnProfile && (
          <div className="mt-4">
            <h3 className="text-white mb-3">
              Pending Challenges ({pendingChallenges.length})
            </h3>
            <PendingChallenges
              challenges={pendingChallenges}
              loading={loadingChallenges}
              onComplete={openCompletionModal}
              onAbandon={handleAbandonChallenge}
            />
          </div>
        )}
      </div>
    </PageLoadWrap>
  );
}
