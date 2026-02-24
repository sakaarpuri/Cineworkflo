import { Search, Camera, Workflow, Database, Wand2, Share2 } from 'lucide-react'

const features = [
  {
    icon: Database,
    title: '150+ Tested Prompts',
    description: 'Every prompt tested and refined for commercial use. No more trial and error.'
  },
  {
    icon: Camera,
    title: 'Shot to Prompt',
    description: 'Upload any reference image or video frame. Get the exact prompt to recreate it.'
  },
  {
    icon: Workflow,
    title: 'Workflow Templates',
    description: 'Turn scripts into shot lists with automatic prompt generation.'
  },
  {
    icon: Wand2,
    title: 'AI Tool Specific',
    description: 'Prompts optimized for Runway Gen-2, Pika 1.0, and Stable Video Diffusion.'
  },
  {
    icon: Share2,
    title: 'One-Click Copy',
    description: 'Copy prompts instantly. Paste into your AI video tool and generate.'
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find prompts by shot type, mood, lighting, camera movement, or subject.'
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for AI Video
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stop spending hours tweaking prompts. Get professional results in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}