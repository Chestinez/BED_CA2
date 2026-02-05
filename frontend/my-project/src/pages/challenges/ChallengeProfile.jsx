import React, { useState, useEffect } from "react";
import { Target, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import {
  ChallengeStatsCard,
  ChallengeGridItem,
  EditChallengeModal,
  DeleteConfirmationModal,
  EmptyState,
  Notification
} from "../../components/challenge";

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
        <Notification notification={notification} />

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
        <ChallengeStatsCard challenges={challenges} />

        {/* Challenges List */}
        {challenges.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="row">
            {challenges.map(challenge => (
              <ChallengeGridItem
                key={challenge.id}
                challenge={challenge}
                getDifficultyName={getDifficultyName}
                onEdit={setEditingChallenge}
                onToggleActive={handleToggleActive}
                onDelete={setShowDeleteModal}
              />
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