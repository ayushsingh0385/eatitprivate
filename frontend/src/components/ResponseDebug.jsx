import React, { useState } from 'react';

const ResponseDebug = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return null;

  return (
    <div className="card fade-in debug-card">
      <div className="card-header">
        <h2><i className="icon-debug"></i> Response Data</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="btn btn-sm btn-outline"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>
      {isExpanded && (
        <div className="card-body">
          <pre className="response-debug">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResponseDebug;
