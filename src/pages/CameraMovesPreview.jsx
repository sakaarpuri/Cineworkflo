import React from 'react';
import CameraMoves from '../components/CameraMovesNew';

export default function CameraMovesPreviewPage() {
  return (
    <div style={{ background: '#F0EEE9', minHeight: '100vh' }}>
      <div style={{ 
        padding: '20px', 
        background: '#1a1a1a', 
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '8px' }}>
          Preview Mode
        </div>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          New Camera Moves Component
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '13px', opacity: 0.7 }}>
          Hover cards to see animations • 16 camera movements included
        </p>
      </div>
      <CameraMoves />
    </div>
  );
}
