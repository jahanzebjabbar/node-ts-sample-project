import React from 'react';

function Spinner() {
  return (
    <div
      style={{
        width: '100%',
        marginTop: '24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="spinner-border text-primary"></div>
    </div>
  );
}

export default Spinner;
