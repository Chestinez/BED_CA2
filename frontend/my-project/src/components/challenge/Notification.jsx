import React from "react";

export default function Notification({ notification }) {
  if (!notification.show) return null;

  return (
    <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} mb-4`}>
      {notification.message}
    </div>
  );
}