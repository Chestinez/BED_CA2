import React from "react";
import { useState, useEffect } from "react";
import api from "../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import ChallengeCard from "../../components/challenge/ChallengeCard";
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
    };

    AllChallengesFetch();
  }, []);

  return (
    <PageLoadWrap>
      <div>
        <h1>Challenges</h1>
        <div className="challenges-container">
          {challenges.length === 0 ? (
            <p className="text-center text-muted">No challenges available.</p>
          ) : (
            challenges.map((challenge) => {
              return (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              );
            })
          )}
        </div>
      </div>
    </PageLoadWrap>
  );
}
