import React from "react";
import { MoreVertical, Edit3, Trash2, Eye, EyeOff, Calendar, Award } from "lucide-react";

export default function ChallengeGridItem({ 
  challenge, 
  getDifficultyName, 
  onEdit, 
  onToggleActive, 
  onDelete 
}) {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className={`card h-100 ${challenge.is_active === "1" ? "bg-dark border-success" : "bg-secondary border-warning"}`}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className={`badge ${challenge.is_active === "1" ? "bg-success" : "bg-warning text-dark"}`}>
            {challenge.is_active === "1" ? "Active" : "Inactive"}
          </span>
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-outline-secondary"
              data-bs-toggle="dropdown"
            >
              <MoreVertical size={16} />
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => onEdit(challenge)}
                >
                  <Edit3 size={16} className="me-2" />
                  Edit
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => onToggleActive(challenge.id, challenge.is_active)}
                >
                  {challenge.is_active === "1" ? (
                    <>
                      <EyeOff size={16} className="me-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye size={16} className="me-2" />
                      Activate
                    </>
                  )}
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item text-danger"
                  onClick={() => onDelete(challenge)}
                >
                  <Trash2 size={16} className="me-2" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">{challenge.title}</h5>
          <p className="card-text text-muted small">
            {challenge.description?.substring(0, 100)}
            {challenge.description?.length > 100 && "..."}
          </p>
          
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-primary">
              {getDifficultyName(challenge.difficulty_id)}
            </span>
            <small className="text-muted">
              <Calendar size={14} className="me-1" />
              {challenge.duration_days} day{challenge.duration_days !== 1 ? 's' : ''}
            </small>
          </div>
          
          <div className="d-flex justify-content-between">
            <span className="text-warning">
              <Award size={16} className="me-1" />
              {challenge.points_rewarded || 0} pts
            </span>
            <span className="text-info">
              💰 {challenge.credits_rewarded || 0} credits
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}