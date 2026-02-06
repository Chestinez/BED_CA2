// Challenges Page - Browse all available challenges
// Filter by active/inactive status, start challenges
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trophy } from "lucide-react";
import BackArrow from "../../components/backArrow/BackArrow";
import api from "../../services/api";
import ContentLoadWrap from "../../components/PageLoader/ContentLoadWrap";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import ChallengeCard from "../../components/challenge/ChallengeCard";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loadChallenges, setLoadChallenges] = useState(true);
  
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoadChallenges(true);
        const response = await api.get("/challenges/selectAll");
        setChallenges(response.data.results);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoadChallenges(false);
      }
    };
    fetchChallenges();
  }, []);

  const handleChallengeUpdate = (challengeId, updatedChallenge) => {
    if (updatedChallenge === null) {
      // Challenge was deleted
      setChallenges(challenges.filter((c) => c.id !== challengeId));
    } else {
      // Challenge was updated
      setChallenges(
        challenges.map((c) => (c.id === challengeId ? updatedChallenge : c)),
      );
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    if (filter === "all") return true;
    if (filter === "active") return challenge.is_active === "1";
    if (filter === "inactive") return challenge.is_active === "0";
    return true;
  });

  return (
    <PageLoadWrap>
      <div className="container-fluid mt-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <BackArrow Title="Challenges" />
              <Link to="/challenges/create" className="btn btn-primary">
                <Plus size={20} className="me-2" />
                Create Challenge
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="btn-group" role="group">
              <button
                className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilter("all")}
              >
                All Missions
              </button>
              <button
                className={`btn ${filter === "active" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilter("active")}
              >
                Active
              </button>
              <button
                className={`btn ${filter === "inactive" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilter("inactive")}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Challenges Container */}
        <ContentLoadWrap isLoading={loadChallenges}>
          <div className="row">
            <div className="col-12">
              <div
                className="challenges-container overflow-auto"
                style={{ maxHeight: "70vh" }}
              >
                {filteredChallenges.length === 0 ? (
                  <div className="text-center text-muted mt-5">
                    <Trophy size={64} className="mb-3 opacity-50" />
                    <p className="h5">No challenges available.</p>
                    <p>Check back later for new missions!</p>
                  </div>
                ) : (
                  filteredChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onChallengeUpdate={handleChallengeUpdate}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </ContentLoadWrap>
      </div>
    </PageLoadWrap>
  );
}
