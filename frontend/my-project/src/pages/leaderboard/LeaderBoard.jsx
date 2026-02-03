import React from "react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import { useAuth } from "../../hooks/useAuth";

export default function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [filterCount, setFilterCount] = useState(10);
  const { setLoading } = useAuth(); // Use the same loading system as PageLoadWrap
  
  const fetchLeaderboard = async (count = 10) => {
    try {
      setError(null);
      const res = await api.get("users/leaderboard", {
        params: { filterCount: count },
      });
      setLeaderboard(res.data.results || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard data");
      setLeaderboard([]);
    }
  };

  const InitialfetchLeaderboard = async (count = 10, showLoader = false) => {
    try {
      setError(null);
      if (showLoader) {
        setLoading(true); // This will trigger PageLoadWrap's loader
      }
      
      const res = await api.get("users/leaderboard", {
        params: { filterCount: count },
      });
      setLeaderboard(res.data.results || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard data");
      setLeaderboard([]);
    } finally {
      if (showLoader) {
        setLoading(false); // This will hide PageLoadWrap's loader
      }
    }
  };

  useEffect(() => {
    // Initial load - let PageLoadWrap handle the loading animation
    InitialfetchLeaderboard(filterCount, false); // Don't show loader on initial load (PageLoadWrap handles it)
  }, []);

  const handleFilterChange = (e) => {
    const value = parseInt(e.target.value) || 10;
    setFilterCount(value);
    fetchLeaderboard(value, true); // Show loader for filter changes
  };

  return (
    <PageLoadWrap>
      <div className="container mt-4">
        <h1 className="text-white mb-4">Leaderboard</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="filterInput" className="form-label text-white">
            Number of users to show:
          </label>
          <input
            id="filterInput"
            type="number"
            className="form-control"
            style={{ maxWidth: "200px" }}
            placeholder="Enter number (default: 10)"
            min="1"
            max="100"
            value={filterCount}
            onChange={handleFilterChange}
          />
        </div>

        <h2 className="text-white mb-3">
          Top {leaderboard.length} Users based on points
        </h2>

        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Username</th>
                <th scope="col">Rank</th>
                <th scope="col">Points</th>
                <th scope="col">Credits</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>{index + 1}</td>
                    <td>{user.username || "Unknown"}</td>
                    <td>
                      <span className="badge bg-primary">
                        {user.rank || "Unranked"}
                      </span>
                    </td>
                    <td>{user.points || 0}</td>
                    <td>{user.credits || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    {error
                      ? "Failed to load data"
                      : "No leaderboard data available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageLoadWrap>
  );
}