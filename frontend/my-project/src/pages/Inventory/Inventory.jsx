// Inventory Page - View and manage owned ship parts
// Equip/unequip parts with slot capacity tracking
import React, { useState, useEffect } from "react";
import { Package, Search } from "lucide-react";
import BackArrow from "../../components/backArrow/BackArrow";
import api from "../../services/api";
import Loader from "../../components/PageLoader/Loader";
import ContentLoadWrap from "../../components/PageLoader/ContentLoadWrap";
import { useAuth } from "../../hooks/useAuth";

export default function Inventory() {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [slotInfo, setSlotInfo] = useState({
    max_slots: 0,
    used_slots: 0,
    remaining_slots: 0,
  });
  const { refreshUserData } = useAuth();

  //as soon as page loads fetch inventory
  useEffect(() => {
    fetchInventory();
    fetchSlotInfo();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resources/inventory");
      setInventory(res.data.results || []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      alert(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlotInfo = async () => {
    try {
      const res = await api.get("/resources/ship");
      setSlotInfo({
        max_slots: res.data.results.max_slots,
        used_slots: res.data.results.used_slots,
        remaining_slots: res.data.results.remaining_slots,
      });
    } catch (err) {
      console.error("Error fetching slot info:", err);
    }
  };

  const handleEquip = async (partId) => {
    try {
      setActionLoading(partId);
      await api.put(`/resources/equip/${partId}`);
      await fetchInventory(); // Refresh to get updated data
      await fetchSlotInfo(); // Refresh slot info
      await refreshUserData(); // Update user stats
    } catch (err) {
      console.error("Error equipping part:", err);
      alert(err.response?.data?.message || "Failed to equip part");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnequip = async (inventoryId) => {
    try {
      setActionLoading(inventoryId);
      await api.put(`/resources/unequip/${inventoryId}`);
      await fetchInventory(); // Refresh to get updated data
      await fetchSlotInfo(); // Refresh slot info
      await refreshUserData(); // Update user stats
    } catch (err) {
      console.error("Error unequipping part:", err);
      alert(err.response?.data?.message || "Failed to unequip part");
    } finally {
      setActionLoading(null);
    }
  };

  const getQualityBadge = (quality) => {
    const badges = {
      common: "bg-secondary",
      rare: "bg-primary",
      epic: "bg-warning text-dark",
      legendary: "bg-danger",
    };
    return badges[quality] || "bg-secondary";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-vh-100 bg-dark">
      <div className="container-fluid pt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <BackArrow Title="Inventory" />
            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <div className="text-muted small">Slot Capacity</div>
                <div className="fw-bold">
                  <span className="text-white">{slotInfo.used_slots}</span>
                  <span className="text-muted"> / {slotInfo.max_slots}</span>
                </div>
              </div>
              <span className="text-muted">{inventory.length} items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <ContentLoadWrap isLoading={loading}>
        {inventory.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <Package size={64} className="mb-3 opacity-50" />
            <p className="h5">No items found</p>
            <p>Visit the shop to purchase ship parts!</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {inventory.map((item) => (
              <div key={item.inventory_id} className="col">
                <div
                  className={`card bg-dark h-100 ${
                    item.is_equipped === "equipped"
                      ? "border-success"
                      : "border-secondary"
                  }`}
                  style={{
                    minWidth: "280px",
                    maxWidth: "450px",
                    margin: "0 auto",
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title text-white">{item.name}</h6>
                      {item.is_equipped === "equipped" && (
                        <span className="badge bg-success">Equipped</span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="card-text text-muted small mb-3">
                      {item.description}
                    </p>

                    {/* Stats */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span
                          className={`badge ${getQualityBadge(item.quality)}`}
                        >
                          {item.quality.toUpperCase()}
                        </span>
                        <span className="text-muted small">
                          {item.category}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-warning small">
                          {item.cost} credits
                        </span>
                        <span className="text-info small">
                          {item.slot_size} slots
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      {item.is_equipped === "equipped" ? (
                        <button
                          className="btn btn-sm btn-outline-danger w-100"
                          onClick={() => handleUnequip(item.inventory_id)}
                          disabled={actionLoading === item.inventory_id}
                        >
                          {actionLoading === item.inventory_id ? (
                            <>Unequipping...</>
                          ) : (
                            "Unequip"
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-success w-100"
                          onClick={() => handleEquip(item.part_id)}
                          disabled={actionLoading === item.part_id}
                        >
                          {actionLoading === item.part_id ? (
                            <>Equipping...</>
                          ) : (
                            "Equip"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ContentLoadWrap>
    </div>
    </div>
  );
}
