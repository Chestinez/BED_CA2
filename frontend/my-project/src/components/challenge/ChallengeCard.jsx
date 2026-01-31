import React from 'react'

export default function ChallengeCard({ challenge }) {
  return (
    <div className="challenge-card">
      <h3>{challenge.title}</h3>
      <p>{challenge.description}</p>
      <p>Points: {challenge.points_rewarded}</p>
      <p>Credits: {challenge.credits_rewarded}</p>
    </div>
  )
}
