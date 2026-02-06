import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Star, 
  Zap, 
  Shield, 
  Box,
  Cpu,
  Settings,
  Crosshair,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from "../../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import { useAuth } from "../../hooks/useAuth";

// Quality color schemes with proper Bootstrap classes and inline styles
const qualityStyles = {
  common: {
    borderClass: 'border-secondary',
    bgStyle: { backgroundColor: 'rgba(108, 117, 125, 0.1)' },
    textClass: 'text-light',
    badgeClass: 'bg-secondary text-white',
    glowStyle: {},
    buttonClass: 'btn-outline-secondary'
  },
  rare: {
    borderClass: 'border-primary',
    bgStyle: { backgroundColor: 'rgba(13, 110, 253, 0.1)' },
    textClass: 'text-primary',
    badgeClass: 'bg-primary text-white',
    glowStyle: { boxShadow: '0 0 15px rgba(13, 110, 253, 0.3)' },
    buttonClass: 'btn-outline-primary'
  },
  epic: {
    borderClass: 'border-warning',
    bgStyle: { backgroundColor: 'rgba(255, 7, 230, 0.1)' },
    textClass: 'text-warning',
    badgeClass: 'bg-warning text-dark',
    glowStyle: { boxShadow: '0 0 15px rgba(197, 7, 255, 0.3)' },
    buttonClass: 'btn-outline-warning'
  },
  legendary: {
    borderClass: 'border-warning',
    bgStyle: { 
      background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.1))',
      backgroundColor: 'rgba(255, 193, 7, 0.15)'
    },
    textClass: 'text-warning',
    badgeClass: 'bg-warning text-dark',
    glowStyle: { boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)' },
    buttonClass: 'btn-outline-warning'
  }
};

// Part category icons
const categoryIcons = {
  'Engine': Zap,
  'Shield': Shield,
  'Weapon': Crosshair,
  'Hull': Box,
  'Hybrid': Cpu
};

export default function Shop() {
  const { user, refreshUserData } = useAuth();
  const [shopData, setShopData] = useState({ owned: [], unowned: [] });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Fetch shop data
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/resources/shop');
        setShopData(response.data.results);
      } catch (error) {
        console.error('Error fetching shop data:', error);
        showNotification('Failed to load shop data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  const categories = [
    { id: 'all', name: 'All Parts', icon: Settings },
    { id: 'Engine', name: 'Engines', icon: Zap },
    { id: 'Shield', name: 'Shields', icon: Shield },
    { id: 'Weapon', name: 'Weapons', icon: Crosshair },
    { id: 'Hull', name: 'Hull', icon: Box },
    { id: 'Hybrid', name: 'Hybrid', icon: Cpu },
  ];

  const qualities = [
    { id: 'all', name: 'All Qualities' },
    { id: 'common', name: 'Common' },
    { id: 'rare', name: 'Rare' },
    { id: 'epic', name: 'Epic' },
    { id: 'legendary', name: 'Legendary' }
  ];

  // Filter parts
  const filteredParts = shopData.unowned.filter(part => {
    const categoryMatch = selectedCategory === 'all' || part.category === selectedCategory;
    const qualityMatch = selectedQuality === 'all' || part.quality === selectedQuality;
    return categoryMatch && qualityMatch;
  });

  // Purchase part
  const handlePurchase = async (partId, partName, cost) => {
    if (!user || user.credits < cost) {
      showNotification('Insufficient credits!', 'error');
      return;
    }

    try {
      setPurchasing(partId);
      await api.post(`/resources/purchase/${partId}`);
      
      // Refresh shop data and user data
      const response = await api.get('/resources/shop');
      setShopData(response.data.results);
      await refreshUserData();
      
      showNotification(`Successfully purchased ${partName}!`, 'success');
    } catch (error) {
      console.error('Error purchasing part:', error);
      const errorMessage = error.response?.data?.message || 'Failed to purchase part';
      showNotification(errorMessage, 'error');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <PageLoadWrap>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="text-center text-white">
            <Settings size={48} className="mb-3 animate-spin" />
            <p>Loading Galactic Shop...</p>
          </div>
        </div>
      </PageLoadWrap>
    );
  }

  return (
    <PageLoadWrap>
      {/* Notification */}
      {notification.show && (
        <div 
          className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} position-fixed`}
          style={{ top: '20px', right: '20px', zIndex: 999, minWidth: '300px' }}
        >
          {notification.message}
        </div>
      )}

      <div className="container-fluid mt-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="text-white mb-1">Galactic Ship Parts Emporium</h1>
                <p className="text-muted">Upgrade your vessel with premium components</p>
              </div>
              <div className="text-end">
                <div className="bg-dark p-3 rounded border border-warning">
                  <div className="d-flex align-items-center text-warning">
                    <ShoppingCart size={24} className="me-2" />
                    <span className="h4 mb-0">{user?.credits || 0} Credits</span>
                  </div>
                  <small className="text-muted">Available Balance</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-md-3 mb-4">
            {/* Categories */}
            <div className="bg-dark p-3 rounded border border-secondary mb-3">
              <h5 className="text-white mb-3">Categories</h5>
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`btn w-100 mb-2 d-flex align-items-center ${
                      selectedCategory === category.id 
                        ? 'btn-primary' 
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <IconComponent size={18} className="me-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Quality Filter */}
            <div className="bg-dark p-3 rounded border border-secondary">
              <h5 className="text-white mb-3">Quality</h5>
              {qualities.map(quality => (
                <button
                  key={quality.id}
                  className={`btn w-100 mb-2 ${
                    selectedQuality === quality.id 
                      ? 'btn-warning' 
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setSelectedQuality(quality.id)}
                >
                  {quality.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parts Grid */}
          <div className="col-md-9">
            {filteredParts.length > 0 ? (
              <div className="row">
                {filteredParts.map(part => {
                  const IconComponent = categoryIcons[part.category] || Settings;
                  const qualityStyle = qualityStyles[part.quality] || qualityStyles.common;
                  const canAfford = user && user.credits >= part.cost;
                  
                  return (
                    <div key={part.id} className="col-lg-4 col-md-6 mb-4">
                      <div 
                        className={`card bg-dark h-100 ${qualityStyle.borderClass}`}
                        style={{
                          ...qualityStyle.bgStyle,
                          ...qualityStyle.glowStyle
                        }}
                      >
                        <div className="card-body d-flex flex-column">
                          {/* Header */}
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center">
                              <IconComponent size={24} className={`me-2 ${qualityStyle.textClass}`} />
                              <h5 className="card-title text-white mb-0">{part.name}</h5>
                            </div>
                            <span className={`badge ${qualityStyle.badgeClass}`}>
                              {part.quality.toUpperCase()}
                            </span>
                          </div>
                          
                          {/* Description */}
                          <p className="card-text text-muted small mb-3">
                            {part.description}
                          </p>
                          
                          {/* Stats */}
                          <div className="mb-3">
                            <div className="d-flex justify-content-between text-sm">
                              <span className="text-muted">Category:</span>
                              <span className={qualityStyle.textClass}>{part.category}</span>
                            </div>
                            <div className="d-flex justify-content-between text-sm">
                              <span className="text-muted">Slots Required:</span>
                              <span className="text-warning">{part.slot_size}</span>
                            </div>
                          </div>
                          
                          {/* Purchase Section */}
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="text-warning h5 mb-0">
                                  {part.cost} Credits
                                </div>
                                {!canAfford && (
                                  <small className="text-danger">Insufficient credits</small>
                                )}
                              </div>
                              <button 
                                className={`btn ${canAfford ? 'btn-success' : 'btn-secondary'}`}
                                disabled={!canAfford || purchasing === part.id}
                                onClick={() => handlePurchase(part.id, part.name, part.cost)}
                              >
                                {purchasing === part.id ? (
                                  <Settings size={16} className="me-1 animate-spin" />
                                ) : (
                                  <ShoppingCart size={16} className="me-1" />
                                )}
                                {purchasing === part.id ? 'Buying...' : 'Purchase'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted mt-5">
                <Settings size={64} className="mb-3 opacity-50" />
                <h4>No parts available</h4>
                <p>Try adjusting your filters or check back later for new inventory.</p>
              </div>
            )}
          </div>
        </div>

        {/* Owned Parts Summary */}
        {shopData.owned.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="bg-dark p-4 rounded border border-success">
                <h5 className="text-success mb-3">
                  <CheckCircle size={20} className="me-2" />
                  Your Inventory ({shopData.owned.length} parts)
                </h5>
                <div className="row">
                  {shopData.owned.slice(0, 6).map(part => (
                    <div key={part.id} className="col-md-2 mb-2">
                      <div className="text-center">
                        <div className={`badge ${qualityStyles[part.quality]?.badgeClass || 'bg-secondary text-white'} mb-1`}>
                          {part.quality}
                        </div>
                        <div className="small text-white">{part.name}</div>
                      </div>
                    </div>
                  ))}
                  {shopData.owned.length > 6 && (
                    <div className="col-md-2 mb-2">
                      <div className="text-center text-muted">
                        +{shopData.owned.length - 6} more...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLoadWrap>
  );
}