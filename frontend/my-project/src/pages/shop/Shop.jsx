import React from 'react'
import {useState, useEffect} from 'react'
import api from "../../services/api";

export default function Shop() {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await api.get("shop/parts");
        setParts(res.data.results);
      } catch (err) {
        console.error("Error fetching parts:", err);
      }
    };
    fetchParts();
  }, [])
  return (
    <div>Shop</div>
  )
}

