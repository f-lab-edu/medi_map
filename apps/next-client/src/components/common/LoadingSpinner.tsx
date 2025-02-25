'use client';

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading_spinner d-flex justify-content-center align-items-center">
      <div className="spinner-grow text-info" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;