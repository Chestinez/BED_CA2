import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import ContentLoadWrap from "../../components/PageLoader/ContentLoadWrap";
import { useAuth } from "../../hooks/useAuth";
import GetLeaderboardPosition from "../../components/leaderboard/GetLeaderboardPosition";

export default function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [filterCount, setFilterCount] = useState(10);
  const { loading, setLoading } = useAuth(); // Use the same loading system as PageLoadWrap
  const {
    position,
    listLoading,
    fetchLeaderboardPosition,
    fetchLeaderboardPositionSelf,
    selectedUser,
    clearSearch,
  } = GetLeaderboardPosition();

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
    clearSearch(); // Clear any search results when changing filter
    fetchLeaderboard(value); // Show loader for filter changes
  };

  const handlePositionSearch = async (username) => {
    await fetchLeaderboardPosition(username);

    // Use a small delay to ensure state has updated
    setTimeout(() => {
      if (position && position > filterCount) {
        setFilterCount(position);
        fetchLeaderboard(position);
      }
    }, 200);
  };

  const getRankColor = (rank) => {
    const ranks = {
      Recruit: "",
      Pilot: "bg-warning",
      Commander: "bg-danger",
      Admiral: "bg-info",
      "Fleet-Admiral": "bg-success",
      "Big-Boss": "bg-dark",
      "Eve-Maestro": "bg-secondary",
      Jaspinos: "bg-primary",
    };
    return ranks[rank] || "";
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

        <label htmlFor="position-username" className="form-label text-white">
          Input Username to get that user Leaderboard Position
        </label>
        <div className="d-inline">
          <input
            type="text"
            placeholder="Username..."
            id="position-username"
            className="form-control mb-3"
          />
          <button
            className="btn btn-success"
            type="button"
            id="position-search"
            onClick={() =>
              handlePositionSearch(
                document.getElementById("position-username").value,
              )
            }
          >
            Search
          </button>
          {(selectedUser || position) && (
            <button
              className="btn btn-outline-light ms-2"
              onClick={() => {
                document.getElementById("position-username").value = "";
                clearSearch();
                fetchLeaderboard(filterCount);
              }}
            >
              Back to Top {filterCount}
            </button>
          )}
        </div>

        <button
          className="btn btn-primary"
          onClick={fetchLeaderboardPositionSelf}
        >
          Get Your Leaderboard Position
        </button>

        <h2 className="text-white mb-3">
          Top {leaderboard.length} Users based on points
        </h2>

        <div className="table-responsive">
          <ContentLoadWrap isLoading={loading || listLoading}>
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col" className="fw-bold">
                    #
                  </th>
                  <th scope="col">Username</th>
                  <th scope="col">Rank</th>
                  <th scope="col">Points</th>
                  <th scope="col">Credits</th>
                </tr>
              </thead>

              <tbody>
                {position && selectedUser ? (
                  <tr>
                    <td className="fw-bold">{position}</td>
                    <td>
                      <Link 
                        to={`/profile/${selectedUser.username}`}
                        className="text-decoration-none text-info"
                      >
                        {selectedUser.username || "Unknown"}
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`badge ${getRankColor(selectedUser.rank)}`}
                      >
                        {selectedUser.rank || "Unranked"}
                      </span>
                    </td>
                    <td>{selectedUser.points || 0}</td>
                    <td>{selectedUser.credits || 0}</td>
                  </tr>
                ) : leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((user, index) => (
                    <tr key={user.id || index}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>
                        <Link 
                          to={`/profile/${user.username}`}
                          className="text-decoration-none text-info"
                        >
                          {user.username || "Unknown"}
                        </Link>
                      </td>
                      <td>
                        <span className={`badge ${getRankColor(user.rank)}`}>
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
          </ContentLoadWrap>
        </div>
      </div>
    </PageLoadWrap>
  );
}
