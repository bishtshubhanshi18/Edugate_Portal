import React from "react";

const NoData = ({ title }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100 my-5">
      <img 
        src="/assets/empty.svg" 
        alt="No data" 
        className="w-50 h-auto mb-3" 
        style={{ maxWidth: '256px', maxHeight: '256px' }}
      />
      <p className="text-muted mt-2">{title || "No data found"}</p>
    </div>
  );
};

export default NoData;