import { useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../../components/navbar/Navbar";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const dashRef = useRef();

  const userProfile = user ? JSON.parse(localStorage.getItem("userData"))[0] : null

  useGSAP(
    () => {
      // We use a Timeline so things happen in a perfect sequence
      const tl = gsap.timeline();

      tl.from(".navbar-brand", { x: -50, opacity: 0, duration: 0.8 }) // Sidebar/Nav first
        .from(
          ".welcome-banner",
          {
            y: -30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4",
        ) // Start slightly early
        .from(
          ".stat-box",
          {
            y: 40,
            opacity: 0,
            scale: 0.9,
            stagger: 0.15,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        );
    },
    { scope: dashRef },
  );

  if (!user) return <div className="text-white p-5">Loading...</div>;

  return (
    <PageLoadWrap>
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
                  className="btn btn-danger position-absolute top-0 end-0"
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

                {/* Progress to next rank (Visual Only for now) */}
                <div
                  className="progress mt-4"
                  style={{ height: "8px", background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="progress-bar bg-info shadow-glow"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <small className="text-white-50 mt-2 d-block">
                  70% to next rank
                </small>
              </div>
            </div>
          </div>

          {/* ROW 2: THE STATS CARDS */}
          <div className="row g-4">
            {/* Points Card */}
            <div className="col-md-4 stat-box">
              <div className="glass-card p-4 text-center h-100 border-neon-blue">
                <p className="text-muted text-uppercase small ls-1">
                  Available Points
                </p>
                <h2 className="fw-bold text-neon-blue">
                  {userProfile.points || 0}
                </h2>
              </div>
            </div>

            {/* Missions Card */}
            <div className="col-md-4 stat-box">
              <div className="glass-card p-4 text-center h-100 border-neon-purple">
                <p className="text-muted text-uppercase small ls-1">Missions</p>
                <h2 className="fw-bold">
                  {userProfile.missions_completed || 0}{" "}
                  <span className="fs-5 opacity-50">
                    / {userProfile.missions_total || 0}
                  </span>
                </h2>
                <small className="text-success">Done</small>
              </div>
            </div>

            {/* Credits Card */}
            <div className="col-md-4 stat-box">
              <div className="glass-card p-4 text-center h-100 border-success">
                <p className="text-muted text-uppercase small ls-1">Credits</p>
                <h2 className="fw-bold text-success">
                  ${userProfile.credits || 0}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLoadWrap>
  );
}
