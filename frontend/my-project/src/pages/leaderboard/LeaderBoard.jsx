import React from "react";
import { useState, useEffect } from "react";
import api from "../../services/api";
export default function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("users/leaderboard", {
          params: { filterCount: 10 },
        });
        setLeaderboard(res.data.results);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, []);
  return (
    <div>
      <h1>Leaderboard</h1>
      <h2>Top {leaderboard.length} Users based off points</h2>
      <div></div>
      <input
        type="number"
        placeholder="Enter number of users to show"
        onChange={(e) => {
          const value = e.target.value;
          const fetchLeaderboardByNumber = async () => {
            try {
              const res = await api.get("users/leaderboard", {
                params: { filterCount: value },
              });
              setLeaderboard(res.data.results);
            } catch (err) {
              console.error("Error fetching leaderboard:", err);
            }
          };
          fetchLeaderboardByNumber();
        }}
      />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Place no.</th>
            <th scope="col">Username</th>
            <th scope="col">Rank</th>
            <th scope="col">Points</th>
            <th scope="col">Credits</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard ? (
            leaderboard.map((user, index) => {
              return (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.rank}</td>
                  <td>{user.points}</td>
                  <td>{user.credits}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No leaderboard data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
