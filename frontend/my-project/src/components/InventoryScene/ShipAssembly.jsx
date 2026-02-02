import React, { useState, useEffect } from 'react';
import { authApi } from '../../services/api';

const baseShipsUrl = {
  1: "/baseShips/Ship1.png",
  2: "/baseShips/Ship2.png",
  3: "/baseShips/Ship3.png",
  4: "/baseShips/Ship4.png",
  5: "/baseShips/Nairan - Battlecruiser - Base.png", // Fleet-Admiral
  6: "/baseShips/Nairan - Dreadnought - Base.png",   // Big-Boss
};

// Define attachment points for each ship type
const shipAttachmentPoints = {
  1: { // Ship1 - Recruit
    Engine: [{ x: 50, y: 80 }, { x: 150, y: 80 }],
    Weapon: [{ x: 100, y: 30 }, { x: 80, y: 50 }, { x: 120, y: 50 }],
    Shield: [{ x: 100, y: 60 }],
    Hull: [{ x: 70, y: 70 }, { x: 130, y: 70 }],
    Hybrid: [{ x: 100, y: 40 }]
  },
  2: { // Ship2 - Pilot
    Engine: [{ x: 60, y: 85 }, { x: 140, y: 85 }],
    Weapon: [{ x: 100, y: 25 }, { x: 75, y: 45 }, { x: 125, y: 45 }],
    Shield: [{ x: 100, y: 55 }],
    Hull: [{ x: 80, y: 75 }, { x: 120, y: 75 }],
    Hybrid: [{ x: 100, y: 35 }]
  },
  3: { // Ship3 - Commander
    Engine: [{ x: 55, y: 90 }, { x: 145, y: 90 }],
    Weapon: [{ x: 100, y: 20 }, { x: 70, y: 40 }, { x: 130, y: 40 }],
    Shield: [{ x: 100, y: 50 }],
    Hull: [{ x: 85, y: 80 }, { x: 115, y: 80 }],
    Hybrid: [{ x: 100, y: 30 }]
  },
  4: { // Ship4 - Admiral
    Engine: [{ x: 65, y: 95 }, { x: 135, y: 95 }],
    Weapon: [{ x: 100, y: 15 }, { x: 65, y: 35 }, { x: 135, y: 35 }],
    Shield: [{ x: 100, y: 45 }],
    Hull: [{ x: 90, y: 85 }, { x: 110, y: 85 }],
    Hybrid: [{ x: 100, y: 25 }]
  },
  5: { // Nairan Battlecruiser - Fleet-Admiral
    Engine: [{ x: 85, y: 200 }, { x: 115, y: 200 }],
    Weapon: [{ x: 100, y: 20 }, { x: 60, y: 60 }, { x: 140, y: 60 }, { x: 80, y: 100 }, { x: 120, y: 100 }],
    Shield: [{ x: 100, y: 80 }, { x: 70, y: 120 }, { x: 130, y: 120 }],
    Hull: [{ x: 100, y: 180 }, { x: 85, y: 140 }, { x: 115, y: 140 }],
    Hybrid: [{ x: 100, y: 40 }, { x: 100, y: 160 }]
  },
  6: { // Nairan Dreadnought - Big-Boss
    Engine: [{ x: 80, y: 220 }, { x: 120, y: 220 }],
    Weapon: [{ x: 100, y: 10 }, { x: 50, y: 50 }, { x: 150, y: 50 }, { x: 75, y: 90 }, { x: 125, y: 90 }],
    Shield: [{ x: 100, y: 70 }, { x: 65, y: 110 }, { x: 135, y: 110 }],
    Hull: [{ x: 100, y: 200 }, { x: 90, y: 150 }, { x: 110, y: 150 }],
    Hybrid: [{ x: 100, y: 30 }, { x: 100, y: 130 }]
  }
};

// Ship styling configuration
const getShipStyle = (rankId) => {
  const baseStyle = {
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 20px rgba(0, 123, 255, 0.3))'
  };

  switch (rankId) {
    case 1: // Ship1
      return { ...baseStyle, maxWidth: '300px', maxHeight: '200px' };
    case 2: // Ship2
      return { ...baseStyle, maxWidth: '320px', maxHeight: '220px' };
    case 3: // Ship3
      return { ...baseStyle, maxWidth: '340px', maxHeight: '240px' };
    case 4: // Ship4
      return { ...baseStyle, maxWidth: '360px', maxHeight: '260px' };
    case 5: // Nairan Battlecruiser - rotate and resize
      return { 
        ...baseStyle, 
        maxWidth: '200px', 
        maxHeight: '400px',
        transform: 'rotate(90deg)',
        transformOrigin: 'center center'
      };
    case 6: // Nairan Dreadnought - rotate and resize
      return { 
        ...baseStyle, 
        maxWidth: '220px', 
        maxHeight: '450px',
        transform: 'rotate(90deg)',
        transformOrigin: 'center center'
      };
    default:
      return { ...baseStyle, maxWidth: '300px', maxHeight: '200px' };
  }
};

export default function ShipAssembly({ profileData }) {
  const [equippedParts, setEquippedParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquippedParts();
  }, []);

  const fetchEquippedParts = async () => {
    try {
      const response = await authApi.get('/resources/inventory/equipped');
      setEquippedParts(response.data.results);
    } catch (err) {
      console.error('Failed to fetch equipped parts:', err);
    } finally {
      setLoading(false);
    }
  };

  const shipSrc = baseShipsUrl[profileData ? profileData.rank_id : 1];
  const attachmentPoints = shipAttachmentPoints[profileData ? profileData.rank_id : 1] || shipAttachmentPoints[1];
  const shipStyle = getShipStyle(profileData ? profileData.rank_id : 1);

  const getPartIcon = (category) => {
    const icons = {
      'Engine': '🚀',
      'Weapon': '⚔️',
      'Shield': '🛡️',
      'Hull': '🔧',
      'Hybrid': '⭐'
    };
    return icons[category] || '⚙️';
  };

  const getPartColor = (category) => {
    const colors = {
      'Engine': '#ff6b35',
      'Weapon': '#dc3545',
      'Shield': '#20c997',
      'Hull': '#6c757d',
      'Hybrid': '#6f42c1'
    };
    return colors[category] || '#007bff';
  };

  const renderEquippedParts = () => {
    const partsByCategory = {};
    
    // Group parts by category
    equippedParts.forEach(part => {
      if (!partsByCategory[part.category]) {
        partsByCategory[part.category] = [];
      }
      partsByCategory[part.category].push(part);
    });

    const renderedParts = [];

    // Render parts at their attachment points
    Object.keys(partsByCategory).forEach(category => {
      const categoryParts = partsByCategory[category];
      const categoryAttachmentPoints = attachmentPoints[category] || [];

      categoryParts.forEach((part, index) => {
        if (index < categoryAttachmentPoints.length) {
          const point = categoryAttachmentPoints[index];
          renderedParts.push(
            <div
              key={`${part.inventory_id}-${index}`}
              className="ship-part"
              style={{
                position: 'absolute',
                left: `${point.x}px`,
                top: `${point.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                backgroundColor: getPartColor(category),
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `0 0 10px ${getPartColor(category)}`,
                cursor: 'pointer',
                animation: 'partPulse 2s ease-in-out infinite'
              }}
              title={`${part.name} (${category})`}
            >
              {getPartIcon(category)}
            </div>
          );
        }
      });
    });

    return renderedParts;
  };

  if (loading) {
    return (
      <div className="shipAssembly d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading ship...</span>
        </div>
      </div>
    );
  }

  // Container style adjustments for rotated ships
  const containerStyle = {
    position: 'relative', 
    display: 'inline-block',
    // Add extra space for rotated ships
    minHeight: profileData?.rank_id >= 5 ? '300px' : 'auto',
    minWidth: profileData?.rank_id >= 5 ? '300px' : 'auto'
  };

  return (
    <div className="shipAssembly" style={{ 
      background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(108, 117, 125, 0.1))',
      borderRadius: '15px',
      padding: '2rem',
      border: '1px solid rgba(0, 123, 255, 0.3)'
    }}>
      <div style={containerStyle}>
        {/* Base Ship Image */}
        <img 
          src={shipSrc} 
          alt="ship" 
          style={shipStyle}
        />
        
        {/* Equipped Parts Overlay */}
        {renderEquippedParts()}
      </div>

      {/* Ship Info */}
      <div className="ship-info mt-3">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-white">
            <strong>{profileData?.rank_name || 'Recruit'} Ship</strong>
          </span>
          <span className="badge bg-primary">
            {equippedParts.length} Parts Equipped
          </span>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes partPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }

        .ship-part:hover {
          transform: translate(-50%, -50%) scale(1.3) !important;
          z-index: 20 !important;
        }
      `}</style>
    </div>
  );
}
