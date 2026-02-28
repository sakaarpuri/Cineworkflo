export default function SocialProofBar() {
  const items = [
    { value: '150+', label: 'Prompt templates' },
    { value: '10+', label: 'Indexable SEO pages' },
    { value: '30-day', label: 'Money-back guarantee' }
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
            <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
        Built for filmmakers and creator teams working across Runway, Pika, Kling, and more.
      </p>
    </div>
  )
}
