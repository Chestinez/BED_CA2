import React from "react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const baseShipsUrl = {
  1: "/baseShips/Ship1.png",
  2: "/baseShips/Ship2.png",
  3: "/baseShips/Ship3.png",
  4: "/baseShips/Ship4.png",
  5: "/baseShips/Ship5.png",
  6: "/baseShips/Ship6.png",
  7: "/baseShips/Nairan - Dreadnought - Base.png",
  8: "/baseShips/Nairan - Battlecruiser - Base.png",
};
export default function Profile() {
  const { user } = useAuth();
  const profileData = user
    ? JSON.parse(localStorage.getItem("userData"))[0]
    : null;
  const shipSrc = baseShipsUrl[profileData ? profileData.i : 1];
  return (
    <>
      <div>Profile Page</div>
    </>
  );
}
