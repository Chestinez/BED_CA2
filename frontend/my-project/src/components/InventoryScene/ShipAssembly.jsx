import React, { useState, useEffect } from 'react';
import { 
  Zap, // Engine
  Shield, // Shield  
  Crosshair, // Weapon
  Box, // Hull
  Cpu, // Hybrid
  Settings,
  Star
} from 'lucide-react';
import api from '../../services/api';

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
  8: "/baseShipsBackgrounds/Roboxel-SpaceBackground01.png", // Fallback
};

// Ship part icons
const partIcons = {
  'Engine': Zap,
  'Shield': Shield,
  'Weapon': Crosshair,
  'Hull': Box,
  'Hybrid': Cpu
};

export default function ShipAssembly({ profileData }) {
  const [equippedParts, setEquippedParts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch equipped parts from API
  useEffect(() => {
    const fetchEquippedParts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/resources/inventory/equipped');
        setEquippedParts(response.data.results || []);
      } catch (error) {
        console.error('Error fetching equipped parts:', error);
        setEquippedParts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquippedParts();
  }, []);

  const shipImage = baseShipsUrl[profileData?.rank_id || 1];
  const background = rankBackgrounds[profileData?.rank_id || 1];

  return (
    <div style={{
      width: '100%'
    }}>
      {/* Main Ship Assembly Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '450px',
        backgroundColor: '#0a0a0a',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #333',
        marginBottom: '16px'
      }}>
        {/* Space Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: '100% 100%', // Force to fill entire container
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
          opacity: 0.8
        }} />

        {/* Gradient overlay for better contrast */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(0,0,50,0.3), rgba(50,0,100,0.2))',
          zIndex: 1
        }} />

        {/* Rank Info */}
        {profileData && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: '8px',
            padding: '12px',
            border: '1px solid #fbbf24',
            zIndex: 10
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fbbf24',
              marginBottom: '4px'
            }}>
              <Star size={18} />
              <span style={{ fontWeight: 'bold' }}>{profileData.rank_name}</span>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#d1d5db'
            }}>
              {profileData.points}pts • {profileData.credits}cr
            </div>
          </div>
        )}

        {/* Main Ship - Center Stage */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-160px', // Half of ship height
          marginLeft: '-160px', // Half of ship width
          zIndex: 5
        }}>
          {/* Ship glow effect */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-200px', // Half of glow size
            marginLeft: '-200px', // Half of glow size
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 3s ease-in-out infinite'
          }} />
          
          {/* Ship image */}
          <img 
            src={shipImage} 
            alt="Player Ship" 
            style={{
              position: 'relative',
              width: '320px',
              height: '320px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.5))',
              zIndex: 10
            }}
            onError={(e) => {
              console.log('Ship image failed to load:', shipImage);
              e.target.src = '/baseShips/Ship1.png'; // Fallback
            }}
          />
        </div>
      </div>

      {/* Equipped Parts - Separate Section Below */}
      <div style={{
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderRadius: '12px',
        border: '1px solid #374151',
        minHeight: '120px' // Added minimum height to make it less skinny
      }}>
        <div style={{ padding: '20px' }}> {/* Increased padding */}
          <h3 style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: '16px', // Increased margin
            fontSize: '18px' // Increased font size
          }}>
            Equipped Parts
          </h3>
          
          {loading ? (
            <div style={{
              textAlign: 'center',
              color: '#9ca3af',
              padding: '24px 0'
            }}>
              <Settings size={32} style={{ 
                margin: '0 auto 8px',
                animation: 'spin 1s linear infinite'
              }} />
              <p>Loading parts...</p>
            </div>
          ) : equippedParts.length > 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '8px'
            }}>
              {equippedParts.map(part => {
                const Icon = partIcons[part.category] || Settings;
                return (
                  <div 
                    key={part.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#1f2937',
                      borderRadius: '8px',
                      border: '1px solid #374151',
                      minWidth: '90px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    title={`${part.name} - ${part.description || 'No description'}`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.backgroundColor = '#1e3a8a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#374151';
                      e.currentTarget.style.backgroundColor = '#1f2937';
                    }}
                  >
                    <Icon size={24} style={{ color: '#3b82f6', marginBottom: '4px' }} />
                    <span style={{
                      fontSize: '12px',
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      {part.name}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: '#9ca3af'
                    }}>
                      {part.category}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#9ca3af',
              padding: '32px 0' // Increased padding for empty state
            }}>
              <Settings size={32} style={{ 
                margin: '0 auto 8px',
                opacity: 0.5
              }} />
              <p>No parts equipped</p>
              <p style={{ fontSize: '14px' }}>Visit the shop to get ship parts</p>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}