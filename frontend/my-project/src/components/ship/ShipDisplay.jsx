import React, { useState, useEffect } from 'react';
import { authApi } from '../../services/api';
import ShipAssembly from '../InventoryScene/ShipAssembly';
import './ship.css';

const ShipDisplay = ({ userId = null, showControls = true }) => {
  const [shipData, setShipData] = useState(null);
  const [equippedParts, setEquippedParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShipData();
    if (showControls) {
      fetchEquippedParts();
    }
  }, [userId]);

  const fetchShipData = async () => {
    try {
      const response = await authApi.get('/resources/ship');
      setShipData(response.data.results);
    } catch (err) {
      setError('Failed to load ship data');
      console.error('Ship data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEquippedParts = async () => {
    try {
      const response = await authApi.get('/resources/inventory/equipped');
      setEquippedParts(response.data.results);
    } catch (err) {
      console.error('Equipped parts error:', err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading ship...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  if (!shipData) {
    return (
      <div className="alert alert-warning text-center">
        <i className="fas fa-ship me-2"></i>
        No ship data available
      </div>
    );
  }

  const getPartsByCategory = (category) => {
    return equippedParts.filter(part => part.category === category);
  };

  return (
    <div className="ship-display-container">
      {/* Ship Header */}
      <div className="ship-header mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h3 className="text-gradient mb-1">
              {shipData.username}'s {shipData.rank_name} Ship
            </h3>
            <p className="text-muted mb-0">
              Slots: {shipData.used_slots}/{shipData.max_slots} 
              <span className="ms-2 badge bg-success">
                {shipData.available_slots} Available
              </span>
            </p>
          </div>
          <div className="col-md-4 text-end">
            <span className="badge bg-primary fs-6">
              Rank: {shipData.rank_name}
            </span>
          </div>
        </div>
      </div>

      {/* Ship Visual using ShipAssembly */}
      <div className="ship-visual-container mb-4">
        <div className="d-flex justify-content-center">
          <ShipAssembly profileData={shipData} />
        </div>
      </div>

      {/* Equipped Parts Display */}
      {showControls && equippedParts.length > 0 && (
        <div className="equipped-parts-section">
          <h5 className="text-gradient mb-3">
            <i className="fas fa-cogs me-2"></i>
            Equipped Parts ({equippedParts.length})
          </h5>
          
          <div className="row">
            {['Engine', 'Weapon', 'Shield', 'Hull', 'Hybrid'].map(category => {
              const categoryParts = getPartsByCategory(category);
              if (categoryParts.length === 0) return null;
              
              return (
                <div key={category} className="col-md-6 col-lg-4 mb-3">
                  <div className="card bg-dark border-secondary h-100">
                    <div className="card-header bg-secondary">
                      <h6 className="mb-0 text-white">
                        <i className={`fas fa-${getCategoryIcon(category)} me-2`}></i>
                        {category}
                      </h6>
                    </div>
                    <div className="card-body">
                      {categoryParts.map(part => (
                        <div key={part.inventory_id} className="mb-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-white small">{part.name}</span>
                            <span className="badge bg-info">{part.slot_size} slots</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Slot Usage Bar */}
      <div className="slot-usage-bar mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-white">Slot Usage</span>
          <span className="text-white">{shipData.used_slots}/{shipData.max_slots}</span>
        </div>
        <div className="progress" style={{ height: '10px' }}>
          <div 
            className={`progress-bar ${getSlotUsageColor(shipData.used_slots, shipData.max_slots)}`}
            role="progressbar" 
            style={{ width: `${(shipData.used_slots / shipData.max_slots) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    'Engine': 'rocket',
    'Weapon': 'crosshairs',
    'Shield': 'shield-alt',
    'Hull': 'cube',
    'Hybrid': 'star'
  };
  return icons[category] || 'cog';
};

const getSlotUsageColor = (used, max) => {
  const percentage = (used / max) * 100;
  if (percentage < 50) return 'bg-success';
  if (percentage < 80) return 'bg-warning';
  return 'bg-danger';
};

export default ShipDisplay;