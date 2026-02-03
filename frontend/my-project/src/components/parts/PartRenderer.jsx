import React from 'react';
import { getPartAsset } from '../../utils/assetManager';

const PartRenderer = ({ 
  part, 
  position = { x: 0, y: 0 }, 
  size = 20, 
  showTooltip = true,
  onClick = null,
  animated = true 
}) => {
  const partAsset = getPartAsset(part.category, part.name);
  
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

  const partStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.6}px`
  };

  // If we have a custom asset, use it as background
  if (partAsset) {
    partStyle.backgroundImage = `url(${partAsset})`;
    partStyle.backgroundSize = 'cover';
    partStyle.backgroundPosition = 'center';
    partStyle.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  } else {
    // Fallback to colored circle with icon
    partStyle.backgroundColor = getPartColor(part.category);
    partStyle.boxShadow = `0 0 10px ${getPartColor(part.category)}`;
  }

  // Add animation class if animated
  if (animated) {
    partStyle.animation = 'partPulse 2s ease-in-out infinite';
  }

  return (
    <>
      <div
        className="part-renderer"
        style={partStyle}
        title={showTooltip ? `${part.name} (${part.category})` : ''}
        onClick={onClick}
        onMouseEnter={(e) => {
          if (onClick) {
            e.target.style.transform = 'translate(-50%, -50%) scale(1.2)';
            e.target.style.zIndex = '20';
          }
        }}
        onMouseLeave={(e) => {
          if (onClick) {
            e.target.style.transform = 'translate(-50%, -50%) scale(1)';
            e.target.style.zIndex = '10';
          }
        }}
      >
        {/* Show icon if no custom asset */}
        {!partAsset && getPartIcon(part.category)}
        
        {/* Glow effect for high-tier parts */}
        {part.slot_size >= 10 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${size * 1.5}px`,
              height: `${size * 1.5}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${getPartColor(part.category)}33 0%, transparent 70%)`,
              zIndex: -1,
              animation: animated ? 'glowPulse 3s ease-in-out infinite' : 'none'
            }}
          />
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes partPulse {
          0%, 100% { 
            opacity: 0.8;
          }
          50% { 
            opacity: 1;
          }
        }

        @keyframes glowPulse {
          0%, 100% { 
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .part-renderer:hover {
          filter: brightness(1.2);
        }
      `}</style>
    </>
  );
};

export default PartRenderer;