import React, { useState, useEffect } from 'react';
import { authApi } from '../../services/api';
import ShipDisplay from './ShipDisplay';
import './ship.css';

const ShipCustomization = () => {
  const [inventory, setInventory] = useState([]);
  const [equippedParts, setEquippedParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ship');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, equippedRes] = await Promise.all([
        authApi.get('/resources/inventory'),
        authApi.get('/resources/inventory/equipped')
      ]);
      
      setInventory(inventoryRes.data.results);
      setEquippedParts(equippedRes.data.results);
    } catch (err) {
      setError('Failed to load ship data');
      console.error('Ship customization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipPart = async (partId) => {
    try {
      setActionLoading(true);
      await authApi.put(`/resources/equip/${partId}`);
      await fetchData(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to equip part');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnequipPart = async (inventoryId) => {
    try {
      setActionLoading(true);
      await authApi.put(`/resources/unequip/${inventoryId}`);
      await fetchData(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unequip part');
    } finally {
      setActionLoading(false);
    }
  };

  const getUnequippedParts = () => {
    return inventory.filter(part => part.is_equipped === 'unequipped');
  };

  const getPartsByCategory = (parts, category) => {
    return parts.filter(part => part.category === category);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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

  return (
    <div className="ship-customization-container">
      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'ship' ? 'active' : ''}`}
            onClick={() => setActiveTab('ship')}
          >
            <i className="fas fa-rocket me-2"></i>
            My Ship
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'equipped' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipped')}
          >
            <i className="fas fa-cogs me-2"></i>
            Equipped Parts ({equippedParts.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <i className="fas fa-warehouse me-2"></i>
            Inventory ({getUnequippedParts().length})
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Ship Display Tab */}
        {activeTab === 'ship' && (
          <div className="tab-pane fade show active">
            <ShipDisplay showControls={true} />
          </div>
        )}

        {/* Equipped Parts Tab */}
        {activeTab === 'equipped' && (
          <div className="tab-pane fade show active">
            <h4 className="text-gradient mb-4">
              <i className="fas fa-cogs me-2"></i>
              Equipped Parts
            </h4>
            
            {equippedParts.length === 0 ? (
              <div className="alert alert-info text-center">
                <i className="fas fa-info-circle me-2"></i>
                No parts equipped. Visit your inventory to equip parts.
              </div>
            ) : (
              <div className="row">
                {['Engine', 'Weapon', 'Shield', 'Hull', 'Hybrid'].map(category => {
                  const categoryParts = getPartsByCategory(equippedParts, category);
                  if (categoryParts.length === 0) return null;
                  
                  return (
                    <div key={category} className="col-12 mb-4">
                      <h5 className="text-white mb-3">
                        <i className={`fas fa-${getCategoryIcon(category)} me-2`}></i>
                        {category} ({categoryParts.length})
                      </h5>
                      <div className="row">
                        {categoryParts.map(part => (
                          <div key={part.inventory_id} className="col-md-6 col-lg-4 mb-3">
                            <div className="card bg-dark border-success">
                              <div className="card-body">
                                <h6 className="card-title text-success">{part.name}</h6>
                                <p className="card-text small text-muted">{part.description}</p>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="badge bg-info">{part.slot_size} slots</span>
                                  <span className="text-warning">{part.cost} credits</span>
                                </div>
                                <button 
                                  className="btn btn-outline-danger btn-sm w-100"
                                  onClick={() => handleUnequipPart(part.inventory_id)}
                                  disabled={actionLoading}
                                >
                                  <i className="fas fa-minus me-1"></i>
                                  Unequip
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="tab-pane fade show active">
            <h4 className="text-gradient mb-4">
              <i className="fas fa-warehouse me-2"></i>
              Ship Parts Inventory
            </h4>
            
            {getUnequippedParts().length === 0 ? (
              <div className="alert alert-info text-center">
                <i className="fas fa-info-circle me-2"></i>
                No unequipped parts in inventory. Visit the shop to purchase parts.
              </div>
            ) : (
              <div className="row">
                {['Engine', 'Weapon', 'Shield', 'Hull', 'Hybrid'].map(category => {
                  const categoryParts = getPartsByCategory(getUnequippedParts(), category);
                  if (categoryParts.length === 0) return null;
                  
                  return (
                    <div key={category} className="col-12 mb-4">
                      <h5 className="text-white mb-3">
                        <i className={`fas fa-${getCategoryIcon(category)} me-2`}></i>
                        {category} ({categoryParts.length})
                      </h5>
                      <div className="row">
                        {categoryParts.map(part => (
                          <div key={part.inventory_id} className="col-md-6 col-lg-4 mb-3">
                            <div className="card bg-dark border-secondary">
                              <div className="card-body">
                                <h6 className="card-title text-white">{part.name}</h6>
                                <p className="card-text small text-muted">{part.description}</p>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="badge bg-info">{part.slot_size} slots</span>
                                  <span className="text-warning">{part.cost} credits</span>
                                </div>
                                <div className="small text-muted mb-2">
                                  Purchased: {new Date(part.purchased_at).toLocaleDateString()}
                                </div>
                                <button 
                                  className="btn btn-outline-success btn-sm w-100"
                                  onClick={() => handleEquipPart(part.part_id)}
                                  disabled={actionLoading}
                                >
                                  <i className="fas fa-plus me-1"></i>
                                  Equip
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
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

export default ShipCustomization;