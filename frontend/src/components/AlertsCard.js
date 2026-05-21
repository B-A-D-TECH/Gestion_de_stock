import React from 'react';

const AlertsCard = ({ title, message, variant }) => {
  return (
    <div className="col-12">
      <div className={`alert alert-${variant} shadow-sm`} role="alert">
        <h5 className="alert-heading">{title}</h5>
        <p className="mb-0">{message}</p>
      </div>
    </div>
  );
};

export default AlertsCard;
