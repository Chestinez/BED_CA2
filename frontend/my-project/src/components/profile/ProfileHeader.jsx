import React from 'react';

export default function ProfileHeader({ profileData }) {
  return (
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
    </div>
  );
}