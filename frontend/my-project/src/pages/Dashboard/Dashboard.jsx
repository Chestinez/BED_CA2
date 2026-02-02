import { useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../../components/navbar/Navbar";
import ShipAssembly from "../../components/InventoryScene/ShipAssembly";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const dashRef = useRef();

  const userProfile = user ? JSON.parse(localStorage.getItem("userData"))[0] : null;

  // Calculate rank progression
  const getRankProgression = () => {
    if (!userProfile) return { percentage: 0, pointsNeeded: 0, isMaxRank: false };
    
    const nextRankPoints = userProfile.next_rank_points;
    const nextRankPercentage = userProfile.next_rank_percentage;
    
    // If no next rank data, user is at max rank
    if (nextRankPoints === null || nextRankPoints === undefined) {
      return { percentage: 100, pointsNeeded: 0, isMaxRank: true };
    }
    
    // Calculate actual percentage (invert the calculation since next_rank_percentage is points needed)
    const totalPointsForNextRank = userProfile.next_rank_minpoints - userProfile.min_points;
    const currentProgress = totalPointsForNextRank - nextRankPoints;
    const actualPercentage = totalPointsForNextRank > 0 ? (currentProgress / totalPointsForNextRank) * 100 : 0;
    
    return {
      percentage: Math.max(0, Math.min(100, actualPercentage)),
      pointsNeeded: nextRankPoints,
      isMaxRank: false
    };
  };

  const rankProgression = getRankProgression();

  useGSAP(
    () => {
      if (!userProfile) return;
      
      // Set initial state
      gsap.set([".welcome-banner", ".stat-box", ".ship-section"], { 
        opacity: 0, 
        y: 30 
      });
      gsap.set(".rank-progress", { scaleX: 0 });
      
      // We use a Timeline so things happen in a perfect sequence
      const tl = gsap.timeline();

      // Animate elements that actually exist
      tl.to(".welcome-banner", { 
        y: 0, 
        opacity: 1, 
        duration: 0.8,
        ease: "power2.out",
      })
      .to(".stat-box", {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.6,
        ease: "back.out(1.7)",
      }, "-=0.4")
      .to(".rank-progress", {
        scaleX: 1,
        duration: 1,
        ease: "power2.out",
      }, "-=0.2")
      .to(".ship-section", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.3");
    },
    { scope: dashRef, dependencies: [userProfile] },
  );

  if (!user) return <div className="text-white p-5">Loading...</div>;

  return (
    <div
      ref={dashRef}
      className="d-flex vh-100 bg-dark text-white overflow-hidden"
    >
      {/* SIDEBAR / NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow-1 p-5 overflow-auto">
        {/* ROW 1: THE WELCOME HERO */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="welcome-banner glass-card p-5 shadow position-relative">
              <button
                className="btn btn-danger position-absolute top-0 end-0 m-3"
                onClick={async () => {
                  await logout();
                  window.location.reload();
                }}
              >
                Logout
              </button>
              <h1 className="display-5 fw-bold text-gradient">
                Welcome, {userProfile.username}!
              </h1>
              <p className="lead opacity-75">
                Current Rank:{" "}
                <span className="text-neon-purple fw-bold">
                  {userProfile.rank}
                </span>
              </p>

              {/* Real Progress to next rank */}
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white-50 small">Rank Progress</span>
                  <span className="text-white-50 small">
                    {rankProgression.isMaxRank 
                      ? "Max Rank Achieved!" 
                      : `${rankProgression.pointsNeeded} points needed`
                    }
                  </span>
                </div>
                <div
                  className="progress"
                  style={{ height: "8px", background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="progress-bar bg-info shadow-glow rank-progress"
                    style={{ 
                      width: `${rankProgression.percentage}%`,
                      transformOrigin: "left center"
                    }}
                  ></div>
                </div>
                <small className="text-white-50 mt-2 d-block">
                  {rankProgression.isMaxRank 
                    ? "You've reached the highest rank!" 
                    : `${Math.round(rankProgression.percentage)}% to next rank`
                  }
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: THE STATS CARDS */}
        <div className="row g-4 mb-4">
          {/* Points Card */}
          <div className="col-md-4 stat-box">
            <div className="glass-card p-4 text-center h-100 border-neon-blue">
              <p className="text-muted text-uppercase small ls-1">
                Available Points
              </p>
              <h2 className="fw-bold text-neon-blue">
                {userProfile.points || 0}
              </h2>
              <small className="text-info">
                Min for rank: {userProfile.min_points || 0}
              </small>
            </div>
          </div>

          {/* Missions Card */}
          <div className="col-md-4 stat-box">
            <div className="glass-card p-4 text-center h-100 border-neon-purple">
              <p className="text-muted text-uppercase small ls-1">Missions</p>
              <h2 className="fw-bold">
                {userProfile.missions_completed || 0}{" "}
                <span className="fs-5 opacity-50">
                   {userProfile.missions_total || 0}
                </span>
              </h2>
              <small className="text-success">Completed</small>
              {userProfile.missions_pending > 0 && (
                <div className="mt-1">
                  <small className="text-warning">
                    {userProfile.missions_pending} pending
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Credits Card */}
          <div className="col-md-4 stat-box">
            <div className="glass-card p-4 text-center h-100 border-success">
              <p className="text-muted text-uppercase small ls-1">Credits</p>
              <h2 className="fw-bold text-success">
                ${userProfile.credits || 0}
              </h2>
              <small className="text-muted">
                For ship upgrades
              </small>
            </div>
          </div>
        </div>

        {/* ROW 3: SHIP PREVIEW */}
        <div className="row">
          <div className="col-12 ship-section">
            <div className="glass-card p-4 shadow">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-gradient mb-0">
                  <i className="fas fa-rocket me-2"></i>
                  Your {userProfile.rank} Ship
                </h4>
                <a href="/ship" className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-cogs me-1"></i>
                  Customize
                </a>
              </div>
              {/* Use ShipAssembly directly instead of ShipDisplay */}
              <div className="d-flex justify-content-center">
                <ShipAssembly profileData={userProfile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
