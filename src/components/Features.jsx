import { Search, Camera, Workflow, Database, Wand2, Share2 } from 'lucide-react'

const features = [
  {
    icon: Database,
    title: '150+ Tested Prompts',
    description: 'Every prompt tested and refined for commercial use. No more trial and error.',
    color: '#2563EB'
  },
  {
    icon: Camera,
    title: 'Shot to Prompt',
    description: 'Upload any reference image or video frame. Get the exact prompt to recreate it.',
    color: '#7C3AED'
  },
  {
    icon: Workflow,
    title: 'Workflow Templates',
    description: 'Turn scripts into shot lists with automatic prompt generation.',
    color: '#059669'
  },
  {
    icon: Wand2,
    title: 'AI Tool Specific',
    description: 'Prompts optimized for Runway Gen-2, Pika 1.0, and Stable Video Diffusion.',
    color: '#DC2626'
  },
  {
    icon: Share2,
    title: 'One-Click Copy',
    description: 'Copy prompts instantly. Paste into your AI video tool and generate.',
    color: '#EA580C'
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find prompts by shot type, mood, lighting, camera movement, or subject.',
    color: '#0891B2'
  }
]

export default function Features() {
  return (
    <section 
      className="py-16 transition-colors relative"
      style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 50%, var(--bg-secondary) 100%)' }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Everything You Need for AI Video
          </h2>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Stop spending hours tweaking prompts. Get professional results in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="p-6 rounded-2xl transition-all hover:-translate-y-1"
              style={{
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-color)'
              }}
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
