import React from 'react';
import { useState, useEffect } from 'react';
import { Package, Grid, List, Filter, Search } from 'lucide-react';
import BackArrow from '../../components/backArrow/BackArrow';
import api from '../../services/api';
import PageLoadWrap from "../../components/PageLoader/pageLoadWrap";
import { useAuth } from "../../hooks/useAuth";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Mock inventory data for UI
  const mockInventory = [
    { id: 1, name: "Plasma Cannon MK-II", category: "weapons", quantity: 2, rarity: "rare", equipped: true },
    { id: 2, name: "Titanium Hull Plating", category: "hulls", quantity: 1, rarity: "epic", equipped: true },
    { id: 3, name: "Ion Blaster", category: "weapons", quantity: 3, rarity: "common", equipped: false },
    { id: 4, name: "Energy Shield Generator", category: "shields", quantity: 1, rarity: "rare", equipped: false },
    { id: 5, name: "Quantum Drive Engine", category: "engines", quantity: 1, rarity: "legendary", equipped: true },
    { id: 6, name: "Basic Hull", category: "hulls", quantity: 5, rarity: "common", equipped: false },
  ];

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await api.get('/resources/inventory');
        setInventory(res.data.results);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError(err.response?.data?.message || "Failed to load inventory");
      }
    }

    fetchInventory();
  }, []);

  const handleEquip = () => {}
  const handleUnequip = () => {}

  const categories = ['all', 'weapons', 'hulls', 'engines', 'shields'];

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-secondary',
      rare: 'text-info',
      epic: 'text-warning',
      legendary: 'text-danger'
    };
    return colors[rarity] || 'text-secondary';
  };

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const GridView = () => (
    <div className="row">
      {filteredInventory.map(item => (
        <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className={`card bg-dark border-secondary h-100 ${item.equipped ? 'border-success' : ''}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="card-title text-white">{item.name}</h6>
                {item.equipped && (
                  <span className="badge bg-success">Equipped</span>
                )}
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className={`badge ${getRarityColor(item.rarity)}`}>
                  {item.rarity}
                </span>
                <span className="text-muted">Qty: {item.quantity}</span>
              </div>
              
              <div className="mt-auto">
                <button 
                  className={`btn btn-sm w-100 ${
                    item.equipped ? 'btn-outline-danger' : 'btn-outline-success'
                  }`}
                >
                  {item.equipped ? 'Unequip' : 'Equip'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="table-responsive">
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Rarity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(item => (
            <tr key={item.id}>
              <td className="text-white">{item.name}</td>
              <td className="text-capitalize">{item.category}</td>
              <td>
                <span className={`badge ${getRarityColor(item.rarity)}`}>
                  {item.rarity}
                </span>
              </td>
              <td>{item.quantity}</td>
              <td>
                {item.equipped ? (
                  <span className="badge bg-success">Equipped</span>
                ) : (
                  <span className="badge bg-secondary">Available</span>
                )}
              </td>
              <td>
                <button 
                  className={`btn btn-sm ${
                    item.equipped ? 'btn-outline-danger' : 'btn-outline-success'
                  }`}
                >
                  {item.equipped ? 'Unequip' : 'Equip'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <PageLoadWrap>
      <div className="container-fluid mt-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <BackArrow Title="Inventory" />
              <div className="d-flex align-items-center">
                <span className="text-muted me-3">
                  {filteredInventory.length} items
                </span>
                <div className="btn-group" role="group">
                  <button 
                    className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} />
                  </button>
                  <button 
                    className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <Filter size={16} className="text-muted me-2" />
              <select
                className="form-select bg-dark text-white border-secondary"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Content */}
        <div className="row">
          <div className="col-12">
            {filteredInventory.length === 0 ? (
              <div className="text-center text-muted mt-5">
                <Package size={64} className="mb-3 opacity-50" />
                <p className="h5">No items found</p>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              viewMode === 'grid' ? <GridView /> : <ListView />
            )}
          </div>
        </div>
      </div>
    </PageLoadWrap>
  );
}
