import React from "react";
export default function ChallengeCard({ challenge }) {
  return (
    <div
      className={`challenge-card ${String(challenge.is_active) === "0" ? "opacity-50" : ""} mb-4 p-3 border rounded`}
    >
      {String(challenge.is_active) === "1" ? (
        <>
          <h3>{challenge.title}</h3>
          <p>{challenge.description}</p>
          <p>Points: {challenge.points_rewarded}</p>
          <p>Credits: {challenge.credits_rewarded}</p>
          <p>Duration: {challenge.duration_days} days</p>
          <div>
            <span
              className={`badge text-dark me-2 ${challenge.difficultyName === "Easy" ? "bg-success" : challenge.difficultyName === "Medium" ? "bg-warning" : "bg-danger"}`}
            >
              Difficulty: {challenge.difficultyName}
            </span>
          </div>
          <p>By: {challenge.creatorName}</p>
          <button className="btn btn-primary"><a href={`/challenges/${challenge.id}`}>Start Challenge</a></button>
        </>
      ) : (
        <>
          <h3 className="alert alert-danger">{challenge.title} Inactive</h3>
          <p>This challenge is currently inactive.</p>
        </>
      )}
    </div>
  );
}
