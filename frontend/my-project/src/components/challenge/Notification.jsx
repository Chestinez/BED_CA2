import React from "react";

export default function Notification({ notification }) {
  if (!notification.show) return null;

  const getAlertClass = () => {
    switch (notification.type) {
      case 'success':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      case 'error':
      default:
        return 'alert-danger';
    }
  };

  return (
    <div className={`alert ${getAlertClass()} mb-4`}>
      {notification.message}
    </div>
  );
}