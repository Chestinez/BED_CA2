import React from 'react'
import {useState, useEffect} from 'react';
import api from "../services/api";
import PageLoadWrap from '../../components/PageLoader/pageLoadWrap';
export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  useEffect(() => {
    // Fetch challenges from API or database
    const AllChallengesFetch = async () => {
      try {
        const res = await api.get("/challenges/selectAll");
        setChallenges(res.data);
      } catch (err) {
        setChallenges([]);
        console.error("Error fetching challenges:", err);
      }
    }
  }, [])
  
  return (
    <PageLoadWrap>
      <div>
        <h1>Challenges</h1>
        <div className="challenges-container">
          {challenges.length === 0 ? (
            <p className="text-center text-muted">No challenges available.</p>
          ) : (
            challenges.map((challenge) => {
              return <div className="challenge-card mb-4" key={challenge.id}>
                
              </div>;
            })
          )
        </div>
      </div>
    </PageLoadWrap>
  )
}
