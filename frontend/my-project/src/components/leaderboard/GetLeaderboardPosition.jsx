import api from "../../services/api";
import { useState } from "react";
export default function GetLeaderboardPosition() {
  const [position, setPosition] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [listLoading, setListLoading] = useState(false);

  const clearSearch = () => {
    setPosition(null);
    setSelectedUser(null);
  };
  const fetchLeaderboardPosition = async (username = null) => {
    try {
      setListLoading(true);
      const res = await api.get(`users/leaderboard/position/username/${username}`)
      setPosition(res.data.position);
      setSelectedUser(res.data.userData);
    } catch (err) {
      console.error("Error fetching leaderboard position:", err);
    } finally {
      setListLoading(false);
    }
  };

  const fetchLeaderboardPositionSelf = async () => {
    try {
      setListLoading(true);
      const res = await api.get(`users/leaderboard/position`);
      setPosition(res.data.position);
      setSelectedUser(res.data.userData);
    } catch (err) {
      console.error("Error fetching leaderboard position:", err);
    } finally {
      setListLoading(false);
    }
  };

  return { position, listLoading, fetchLeaderboardPosition, fetchLeaderboardPositionSelf, selectedUser, clearSearch };
}
