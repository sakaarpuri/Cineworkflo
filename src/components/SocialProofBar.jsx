export default function SocialProofBar({ variant = 'hero' }) {
  const items = variant === 'pricing'
    ? [
        { value: '30-day', label: 'Money-back guarantee' },
        { value: 'Instant', label: 'Access after checkout' },
        { value: 'Works with', label: 'Runway • Pika • Kling • Luma' }
      ]
    : [
        { value: 'Works with', label: 'Runway • Pika • Kling • Luma' },
        { value: 'Modes', label: 'Beginner + Pro detail level' },
        { value: 'Workflow', label: 'Vault + tools + camera moves' }
      ]

  return (
    <div
      className="mt-8 rounded-2xl p-4"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)'
      }}
    >
      <div className="grid sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="text-center py-2">
            <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>{item.value}</div>
            <div className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
        Built for filmmakers and creator teams working across Runway, Pika, Kling, and more.
      </p>
    </div>
  )
}
