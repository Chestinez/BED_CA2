import React from "react";
import { Target, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState() {
  return (
    <div className="text-center py-5">
      <Target size={64} className="text-muted mb-3" />
      <h4 className="text-muted">No Challenges Created</h4>
      <p className="text-muted">Start building your challenge empire!</p>
      <Link to="/challenges/create" className="btn btn-primary">
        <Plus size={20} className="me-2" />
        Create Your First Challenge
      </Link>
    </div>
  );
}