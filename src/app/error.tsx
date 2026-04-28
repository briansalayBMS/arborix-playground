'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 48, fontFamily: 'Inter, sans-serif' }}>
      <p style={{ fontSize: 12, color: '#86868B', marginBottom: 16 }}>RUNTIME ERROR</p>
      <p style={{ fontSize: 16, color: '#1D1D1F', marginBottom: 24 }}>{error.message}</p>
      <button onClick={reset} style={{ fontSize: 12, color: '#0071E3', background: 'none', border: 0, cursor: 'pointer', padding: 0 }}>Reload</button>
    </div>
  )
}
