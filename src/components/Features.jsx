import { Search, Camera, Workflow, Database, Wand2, Share2 } from 'lucide-react'

const features = [
  {
    icon: Database,
    title: '150+ Tested Prompts',
    description: '150+ prompts battle-tested for commercial shoots. Your render credits will thank you.',
    color: '#2563EB'
  },
  {
    icon: Camera,
    title: 'Shot to Prompt',
    description: 'See it. Upload it. Recreate it. Reverse-engineer any shot in seconds.',
    color: '#7C3AED'
  },
  {
    icon: Workflow,
    title: 'Workflow Templates',
    description: 'From script to shot list to prompts, your pre-production pipeline automated.',
    color: '#059669'
  },
  {
    icon: Wand2,
    title: 'AI Tool Specific',
    description: 'Tuned for Runway, Pika, Kling and more. Cinematic means different things to different AIs.',
    color: '#DC2626'
  },
  {
    icon: Share2,
    title: 'One-Click Copy',
    description: 'Copy. Paste. Generate. No prompt-engineering degree required.',
    color: '#EA580C'
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Search by vibe, not just keywords. Filter by mood, movement, and lighting.',
    color: '#0891B2'
  }
]

export default function Features() {
  return (
    <section 
      className="py-16 transition-colors relative"
      style={{ background: 'transparent' }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Your entire AI video toolkit. Minus the guesswork.
          </h2>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Skip the hours of prompt-tweaking. Get commercial-quality results on the first try.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="neu-card p-6 rounded-2xl transition-all hover:-translate-y-1"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${feature.color}15`
                }}
              >
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <h3 
                className="text-lg font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
