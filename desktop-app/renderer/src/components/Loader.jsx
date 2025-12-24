import React from 'react';

export default function Loader() {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 8px', width: 36, height: 36, border:'4px solid #eee', borderTop:'4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div>Loading…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
