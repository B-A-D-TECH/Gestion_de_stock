import React from 'react';

const StatsCard = ({ title, value, variant }) => {
  return (
    <div className="col-md-3">
      <div className={`card text-white bg-${variant} h-100 shadow-sm`}>
        <div className="card-body">
          <h6 className="card-title">{title}</h6>
          <p className="display-6 mb-0">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
