import React from 'react';
import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Zap, Shield, Wrench } from 'lucide-react';
import api from "../../services/api";
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";

export default function Shop() {
  const [parts, setParts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userCredits, setUserCredits] = useState(1500); // Mock data

  // Mock parts data for UI
  const mockParts = [
    { id: 1, name: "Plasma Cannon MK-II", category: "weapons", price: 250, rarity: "rare", description: "High-energy plasma weapon with enhanced targeting" },
    { id: 2, name: "Titanium Hull Plating", category: "hulls", price: 400, rarity: "epic", description: "Military-grade armor plating" },
    { id: 3, name: "Quantum Drive Engine", category: "engines", price: 600, rarity: "legendary", description: "Faster-than-light propulsion system" },
    { id: 4, name: "Energy Shield Generator", category: "shields", price: 300, rarity: "rare", description: "Deflects incoming projectiles" },
    { id: 5, name: "Ion Blaster", category: "weapons", price: 150, rarity: "common", description: "Standard energy weapon" },
    { id: 6, name: "Stealth Hull", category: "hulls", price: 500, rarity: "epic", description: "Reduces radar signature" },
  ];

  useEffect(() => {
    // For now use mock data, replace with API call later
    setParts(mockParts);
  }, []);

  const categories = [
    { id: 'all', name: 'All Parts', icon: Wrench },
    { id: 'weapons', name: 'Weapons', icon: Zap },
    { id: 'hulls', name: 'Hulls', icon: Shield },
    { id: 'engines', name: 'Engines', icon: Star },
    { id: 'shields', name: 'Shields', icon: Shield },
  ];

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-secondary',
      rare: 'text-info',
      epic: 'text-warning',
      legendary: 'text-danger'
    };
    return colors[rarity] || 'text-secondary';
  };

  const filteredParts = selectedCategory === 'all' 
    ? parts 
    : parts.filter(part => part.category === selectedCategory);

  return (
    <PageLoadWrap>
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Header */}
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="text-white mb-0">Ship Parts Shop</h1>
              <div className="text-warning">
                <ShoppingCart className="me-2" size={24} />
                <span className="h4 mb-0">{userCredits} Credits</span>
              </div>
            </div>
          </div>

          {/* Categories Sidebar */}
          <div className="col-md-3 mb-4">
            <div className="bg-dark p-3 rounded border border-secondary">
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
          </div>

          {/* Parts Grid */}
          <div className="col-md-9">
            <div className="row">
              {filteredParts.map(part => (
                <div key={part.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card bg-dark border-secondary h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title text-white">{part.name}</h5>
                        <span className={`badge ${getRarityColor(part.rarity)}`}>
                          {part.rarity}
                        </span>
                      </div>
                      
                      <p className="card-text text-muted small">
                        {part.description}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-warning h5 mb-0">
                            {part.price} Credits
                          </span>
                          <button 
                            className="btn btn-success btn-sm"
                            disabled={userCredits < part.price}
                          >
                            <ShoppingCart size={16} className="me-1" />
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredParts.length === 0 && (
              <div className="text-center text-muted mt-5">
                <p>No parts available in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLoadWrap>
  );
}

