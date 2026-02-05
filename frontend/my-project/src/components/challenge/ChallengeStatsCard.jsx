import React from "react";

export default function ChallengeStatsCard({ challenges }) {
  const totalPoints = challenges.reduce((sum, c) => sum + (c.points_rewarded || 0), 0);
  const totalCredits = challenges.reduce((sum, c) => sum + (c.credits_rewarded || 0), 0);
  const activeCount = challenges.filter(c => c.is_active === "1").length;
  const inactiveCount = challenges.filter(c => c.is_active === "0").length;

  return (
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="card bg-dark border-secondary">
          <div className="card-body text-center">
            <h5 className="text-primary">{challenges.length}</h5>
            <small className="text-muted">Total Challenges</small>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-dark border-secondary">
          <div className="card-body text-center">
            <h5 className="text-success">{activeCount}</h5>
            <small className="text-muted">Active</small>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-dark border-secondary">
          <div className="card-body text-center">
            <h5 className="text-warning">{inactiveCount}</h5>
            <small className="text-muted">Inactive</small>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-dark border-secondary">
          <div className="card-body text-center">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="text-warning mb-0">{totalPoints}</h6>
                <small className="text-muted">Points</small>
              </div>
              <div>
                <h6 className="text-info mb-0">{totalCredits}</h6>
                <small className="text-muted">Credits</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}