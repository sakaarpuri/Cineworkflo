import React from 'react'

// Simplified App for testing
function SimpleApp() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', background: '#F5F3EE', minHeight: '100vh' }}>
      <h1 style={{ color: '#111827', fontSize: '48px', fontWeight: 'bold' }}>
        Get videos right in one <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>take</span> <span style={{ color: '#2563EB' }}>prompt</span>
      </h1>
      <p style={{ color: '#6B7280', fontSize: '20px', marginTop: '20px' }}>
        Professionally crafted prompts for Runway, Pika, Kling, Luma, and other AI video tools.
      </p>
      <button style={{ 
        marginTop: '30px', 
        padding: '16px 32px', 
        background: '#2563EB', 
        color: 'white', 
        border: 'none', 
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: '600',
        cursor: 'pointer'
      }}>
        Get Pro
      </button>
    </div>
  )
}

export default SimpleApp
