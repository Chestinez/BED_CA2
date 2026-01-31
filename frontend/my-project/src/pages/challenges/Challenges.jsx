import React from 'react'
import {useState, useEffect} from 'react';
import api from "../services/api";
import {}
export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  useEffect(() => {
    // Fetch challenges from API or database
    const AllChallengesFetch = async () => {
      try {
        const res = await api.get("/challenges/selectAll");
        setChallenges(res.data);
      } catch (err) {
        
      }
    }
  }, [])
  return (
    <div>Challenges</div>
  )
}
