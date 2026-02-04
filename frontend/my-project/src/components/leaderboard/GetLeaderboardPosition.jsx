import React from "react";
import api from "../../services/api";
import { useState } from "react";
export default function GetLeaderboardPosition() {
  const [position, setPosition] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const fetchLeaderboardPosition = async (username = null) => {
    try {
      setListLoading(true);
      const res = username
        ? await api.get(`users/leaderboard/position/${username}`)
        : await api.get("users/leaderboard/position");
      setPosition(res.data.position);
    } catch (err) {
      console.error("Error fetching leaderboard position:", err);
    } finally {
      setListLoading(false);
    }
  };

  return { position, listLoading, fetchLeaderboardPosition };
}
