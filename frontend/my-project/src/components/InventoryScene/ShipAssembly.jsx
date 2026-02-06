import React, { useState, useEffect } from "react";
import { Zap, Shield, Crosshair, Box, Cpu, Settings, Star } from "lucide-react";
import api from "../../services/api";
import ContentLoadWrap from "../PageLoader/ContentLoadWrap";

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

// Background based on rank - same mapping as ships

const rankBackgrounds = {
  1: "/baseShipsBackgrounds/Roboxel-SpaceBackground01.png",
  2: "/baseShipsBackgrounds/Roboxel-SpaceBackground02.png",
  3: "/baseShipsBackgrounds/Roboxel-SpaceBackground06.png",
  4: "/baseShipsBackgrounds/Roboxel-SpaceBackground07.png",
  5: "/baseShipsBackgrounds/Roboxel-SpaceBackground08.png",
  6: "/baseShipsBackgrounds/Roboxel-SpaceBackground09.png",
  7: "/baseShipsBackgrounds/Roboxel-SpaceBackground10.png",
  8: "/baseShipsBackgrounds/blue-preview.png",
};

const partIcons = {
  Engine: Zap,
  Shield,
  Weapon: Crosshair,
  Hull: Box,
  Hybrid: Cpu,
};

const qualityClasses = {
  common: "border-secondary bg-dark text-light",
  rare: "border-primary bg-primary bg-opacity-10 text-primary",
  epic: "border-info bg-info bg-opacity-10 text-info", // Using info for purple-ish
  legendary: "border-warning bg-warning bg-opacity-10 text-warning",
};

export default function ShipAssembly({ profileData }) {
  const [equippedParts, setEquippedParts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEquippedParts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/resources/inventory/equipped");
        setEquippedParts(response.data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquippedParts();
  }, []);

  const rankId = profileData?.rank_id || 1;

  return (
    <div className="w-100">
      {/* Main Ship Display */}
      <div
        className="position-relative w-100 rounded-3 border border-secondary overflow-hidden shadow-lg"
        style={{
          height: "450px",
          backgroundImage: `url(${rankBackgrounds[rankId]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay for contrast */}
        <div
          className="position-absolute inset-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.4)" }}
        />

        {/* Rank Badge */}
        <div className="position-absolute top-0 start-0 m-3 p-2 bg-dark bg-opacity-75 border border-warning rounded shadow">
          <div className="d-flex align-items-center gap-2 text-warning fw-bold">
            <Star size={16} /> {profileData?.rank_name || "Recruit"}
          </div>
          <small className="text-white-50">{profileData?.points}pts</small>
        </div>

        {/* Ship Image */}
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <img
            src={baseShipsUrl[rankId]}
            className="img-fluid"
            style={{
              width: "300px",
              filter: "drop-shadow(0 0 15px rgba(221, 0, 255, 0.5))",
            }}
            alt="Ship"
          />
        </div>
      </div>

      {/* Parts Section */}
      <div className="mt-3 p-3 bg-dark bg-opacity-50 border border-secondary rounded-3">
        <h5 className="text-white text-center mb-3 small tracking-widest uppercase">
          Equipped Modules
        </h5>

        <div className="d-flex justify-content-center flex-wrap gap-2">
          {loading ? (
            <div className="text-muted small">Accessing inventory...</div>
          ) : equippedParts.length > 0 ? (
            equippedParts.map((part) => {
              const Icon = partIcons[part.category] || Settings;
              return (
                <div
                  key={part.id}
                  className={`p-2 border rounded text-center d-flex flex-column align-items-center ${qualityClasses[part.quality]}`}
                  style={{ minWidth: "100px", transition: "0.2s" }}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="small fw-bold d-block">{part.name}</span>
                  <span
                    className="tiny text-uppercase opacity-75"
                    style={{ fontSize: "9px" }}
                  >
                    {part.quality}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-muted small">No modules equipped.</p>
          )}
        </div>
      </div>
    </div>
  );
}
