import React from 'react';

const LoadingSpinner = ({ size = '3rem' }) => {
  return (
    <div className="d-flex justify-content-center align-items-center my-4">
      <div className="spinner-border text-primary" role="status" style={{ width: size, height: size }}>
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
