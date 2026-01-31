import React from "react";
export default function ChallengeCard({ challenge }) {
  return (
    <div
      className={`challenge-card ${!challenge.is_Active || challenge.is_Active === "0" ? "opacity-50" : ""} mb-4 p-3 border rounded`}
    >
      {challenge.is_Active === "1" ? (
        <>
          <h3>{challenge.title}</h3>
          <p>{challenge.description}</p>
          <p>Points: {challenge.points_rewarded}</p>
          <p>Credits: {challenge.credits_rewarded}</p>
          <p></p>
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
