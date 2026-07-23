'use client';

import { useEffect } from 'react';

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('App error:', error.message, error.stack);
  }, [error]);

  return (
    <div style={{ padding: 24, color: '#F0F6FC', background: '#0D1117', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h2 style={{ color: '#EF4444', marginBottom: 12 }}>Something went wrong</h2>
      <pre style={{ color: '#F5A623', fontSize: 13, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
        {error.message}
      </pre>
      <pre style={{ color: '#8B949E', fontSize: 11, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
        {error.stack}
      </pre>
      <button
        onClick={reset}
        style={{ background: '#F5A623', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  );
}
