import React from "react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import ChallengeCard from "../../components/challenge/ChallengeCard";
export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  useEffect(() => {
    // Fetch challenges from API or database
    const AllChallengesFetch = async () => {
      try {
        const res = await api.get("/challenges/selectAll");
        setChallenges(res.data.results);
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
        <div className="challenges-container overflow-auto" style={{ maxHeight: "100vh" }}>
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
        <button className="btn btn-primary"><a href="/createChallenge">Create Challenge</a></button>
      </div>
    </PageLoadWrap>
  );
}
