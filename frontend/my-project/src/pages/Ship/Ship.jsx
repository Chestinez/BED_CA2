import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import PageLoadWrap from '../../components/PageLoader/PageLoadWrap';
import ShipCustomization from '../../components/ship/ShipCustomization';

const Ship = () => {
  return (
    <PageLoadWrap>
      <div className="d-flex vh-100 bg-dark text-white overflow-hidden">
        {/* SIDEBAR / NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow-1 p-4 overflow-auto">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1 className="display-6 fw-bold text-gradient mb-2">
                    <i className="fas fa-rocket me-3"></i>
                    Ship Customization
                  </h1>
                  <p className="lead opacity-75 mb-0">
                    Customize your ship with parts based on your rank
                  </p>
                </div>
                <div className="text-end">
                  <div className="badge bg-primary fs-6 px-3 py-2">
                    <i className="fas fa-star me-2"></i>
                    Starship Systems
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ship Customization Component */}
          <div className="row">
            <div className="col-12">
              <div className="glass-card p-4 shadow">
                <ShipCustomization />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLoadWrap>
  );
};

export default Ship;