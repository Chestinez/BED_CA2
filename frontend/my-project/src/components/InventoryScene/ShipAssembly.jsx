import React from 'react'

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

export default function ShipAssembly({profileData}) {
  const shipSrc = baseShipsUrl[profileData ? profileData.rank_id : 1];
  return (
    <div className="shipAssembly">
      <img src={shipSrc} alt="ship" />
    </div>
  )
}
