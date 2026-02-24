import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vxpppjhsnnfoggigxupo.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cHBwamhzbm5mb2dnaWd4dXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2ODQyOCwiZXhwIjoyMDg3NTQ0NDI4fQ.cZyVuWdntAHir-8paDUfkzNClCAylAobTLs0-KW9P-s'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const prompts = [
  // FREE TIER - PRODUCT DEMO (5)
  {
    title: 'Cinematic Product Rotation',
    prompt: 'Cinematic product shot, rotating 360° on seamless black background, studio lighting with soft reflections, shallow depth of field, 8K quality, motion blur on rotation, professional commercial aesthetic, clean minimal setup',
    category: 'Product Demo',
    tool: 'Runway',
    tags: ['product', 'commercial', 'rotation', '360'],
    is_premium: false
  },
  {
    title: 'Floating Product Showcase',
    prompt: 'Elegant product floating in mid-air, zero gravity effect, soft studio lighting from above, subtle shadows on white surface, minimalist aesthetic, premium brand feel, shallow depth of field, 4K commercial quality',
    category: 'Product Demo',
    tool: 'Pika',
    tags: ['product', 'floating', 'minimal', 'premium'],
    is_premium: false
  },
  {
    title: 'Product Unboxing Motion',
    prompt: 'Smooth hands opening premium product packaging, overhead angle, soft natural lighting, anticipation building, reveal moment, unboxing experience, social media style, shallow depth of field on product',
    category: 'Product Demo',
    tool: 'Runway',
    tags: ['product', 'unboxing', 'hands', 'social'],
    is_premium: false
  },
  {
    title: 'Luxury Product Detail Shot',
    prompt: 'Extreme close-up of luxury product texture, macro lens effect, dramatic side lighting creating highlights on metallic surface, shallow depth of field, premium craftsmanship focus, cinematic mood',
    category: 'Product Demo',
    tool: 'Runway',
    tags: ['product', 'macro', 'luxury', 'detail'],
    is_premium: false
  },
  {
    title: 'Product Lifestyle Context',
    prompt: 'Product naturally placed in lifestyle setting, soft morning light through window, authentic environment, subtle hand interacting with product, Instagram aesthetic, warm tones, shallow depth of field',
    category: 'Product Demo',
    tool: 'Pika',
    tags: ['product', 'lifestyle', 'natural', 'warm'],
    is_premium: false
  },

  // FREE TIER - B-ROLL (5)
  {
    title: 'Smooth Aerial Drone Shot',
    prompt: 'Aerial drone footage, smooth gliding motion over landscape, golden hour lighting, cinematic color grade, slight lens flare, professional travel documentary style, 4K resolution, sweeping vista',
    category: 'B-Roll',
    tool: 'Pika',
    tags: ['drone', 'landscape', 'travel', 'aerial'],
    is_premium: false
  },
  {
    title: 'Handheld Documentary Style',
    prompt: 'Handheld camera movement, subtle natural shake, following subject through environment, natural lighting, documentary style, authentic feel, slight motion blur on edges, cinéma vérité aesthetic',
    category: 'B-Roll',
    tool: 'Runway',
    tags: ['handheld', 'documentary', 'natural', 'authentic'],
    is_premium: false
  },
  {
    title: 'Gimbal Walking Shot',
    prompt: 'Smooth gimbal stabilized walking shot, following subject from behind, urban environment, shallow depth of field, cinematic motion, professional music video aesthetic, golden hour lighting',
    category: 'B-Roll',
    tool: 'Pika',
    tags: ['gimbal', 'walking', 'urban', 'smooth'],
    is_premium: false
  },
  {
    title: 'Establishing Wide Shot',
    prompt: 'Wide establishing shot of location, slow push-in movement, dramatic sky, sense of scale, cinematic composition, professional film opening aesthetic, 4K quality, epic feel',
    category: 'B-Roll',
    tool: 'Runway',
    tags: ['wide', 'establishing', 'epic', 'scale'],
    is_premium: false
  },
  {
    title: 'Close-Up Detail B-Roll',
    prompt: 'Intimate close-up shots, shallow depth of field, hands working on craft, texture focus, warm natural lighting, documentary style, emotional connection, professional color grade',
    category: 'B-Roll',
    tool: 'Pika',
    tags: ['closeup', 'detail', 'hands', 'craft'],
    is_premium: false
  },

  // FREE TIER - INTERVIEW (5)
  {
    title: 'Dramatic Lighting Portrait',
    prompt: 'Dramatic interview lighting, Rembrandt style with triangle highlight on cheek, subject looking slightly off-camera, shallow depth of field, film grain texture, cinematic mood, dark background with rim light separation',
    category: 'Interview',
    tool: 'Runway',
    tags: ['interview', 'portrait', 'dramatic', 'rembrandt'],
    is_premium: false
  },
  {
    title: 'Clean Corporate Interview',
    prompt: 'Clean professional interview setup, soft even lighting, neutral background, subject centered, broadcast quality, corporate documentary style, sharp focus, professional headshot aesthetic',
    category: 'Interview',
    tool: 'Pika',
    tags: ['interview', 'corporate', 'clean', 'professional'],
    is_premium: false
  },
  {
    title: 'Natural Window Light Interview',
    prompt: 'Natural window light interview, soft diffused lighting on subject, environmental background showing context, authentic feel, documentary style, shallow depth of field, warm tones',
    category: 'Interview',
    tool: 'Runway',
    tags: ['interview', 'natural', 'window', 'authentic'],
    is_premium: false
  },
  {
    title: 'Silhouette Interview',
    prompt: 'Dramatic silhouette of subject against bright background, rim lighting creating edge separation, mysterious mood, subject gesturing, cinematic interview style, high contrast',
    category: 'Interview',
    tool: 'Pika',
    tags: ['interview', 'silhouette', 'dramatic', 'moody'],
    is_premium: false
  },
  {
    title: 'Two-Person Interview Setup',
    prompt: 'Two-shot interview framing, both subjects in frame, professional lighting on both, shallow depth of field, over-shoulder angle option, broadcast documentary style, engaging conversation feel',
    category: 'Interview',
    tool: 'Runway',
    tags: ['interview', 'two-shot', 'conversation', 'broadcast'],
    is_premium: false
  },

  // FREE TIER - MOTION GRAPHICS (5)
  {
    title: 'Seamless Loop Background',
    prompt: 'Abstract flowing particles, seamless loop animation, soft gradients in teal and coral, gentle organic motion, perfect for text overlay, 4K, smooth 60fps, corporate presentation aesthetic',
    category: 'Motion Graphics',
    tool: 'Runway',
    tags: ['background', 'loop', 'abstract', 'particles'],
    is_premium: false
  },
  {
    title: 'Cinematic Title Background',
    prompt: 'Dramatic cinematic background for titles, subtle smoke or fog, moody lighting, dark tones with accent color, film grain texture, perfect for opening credits, epic feel',
    category: 'Motion Graphics',
    tool: 'Pika',
    tags: ['titles', 'background', 'cinematic', 'moody'],
    is_premium: false
  },
  {
    title: 'Data Visualization Motion',
    prompt: 'Clean data visualization motion graphics, bar charts growing, numbers counting up, tech aesthetic, blue and white color scheme, corporate style, smooth animations, professional presentation',
    category: 'Motion Graphics',
    tool: 'Runway',
    tags: ['data', 'charts', 'corporate', 'tech'],
    is_premium: false
  },
  {
    title: 'Social Media Text Background',
    prompt: 'Vibrant background for social media text, trending gradient colors, subtle motion, youth aesthetic, Instagram/TikTok style, energetic feel, 9:16 vertical format optimized',
    category: 'Motion Graphics',
    tool: 'Pika',
    tags: ['social', 'background', 'trending', 'vertical'],
    is_premium: false
  },
  {
    title: 'Logo Reveal Animation',
    prompt: 'Professional logo reveal, elegant animation, particle effects forming logo, corporate style, clean background, smooth motion, premium brand introduction, 4K quality',
    category: 'Motion Graphics',
    tool: 'Runway',
    tags: ['logo', 'reveal', 'corporate', 'elegant'],
    is_premium: false
  },

  // FREE TIER - TRANSITIONS (5)
  {
    title: 'Smooth Whip Pan',
    prompt: 'Fast whip pan transition, motion blur streaking across frame, energetic direction change, music video style, dynamic energy, seamless cut point, professional editing aesthetic',
    category: 'Transitions',
    tool: 'Runway',
    tags: ['whip', 'pan', 'fast', 'energy'],
    is_premium: false
  },
  {
    title: 'Match Cut Frame',
    prompt: 'Match cut on similar shapes or colors between two scenes, visual continuity, editorial precision, clever transition, professional film editing, satisfying connection, artistic flow',
    category: 'Transitions',
    tool: 'Pika',
    tags: ['match', 'cut', 'continuity', 'editorial'],
    is_premium: false
  },
  {
    title: 'Fade to Black Dramatic',
    prompt: 'Slow dramatic fade to black, emotional beat, cinematic pause, film ending aesthetic, intentional timing, melancholy or reflective mood, professional color grade to black',
    category: 'Transitions',
    tool: 'Runway',
    tags: ['fade', 'black', 'dramatic', 'emotional'],
    is_premium: false
  },
  {
    title: 'Zoom Blur Transition',
    prompt: 'Quick zoom with radial blur transition, disorienting yet energetic, warp speed effect, dynamic movement, action sequence style, high energy cut, music video aesthetic',
    category: 'Transitions',
    tool: 'Pika',
    tags: ['zoom', 'blur', 'radial', 'energy'],
    is_premium: false
  },
  {
    title: 'Clean Cut on Action',
    prompt: 'Clean cut on peak action moment, movement carrying across cut, invisible transition, professional continuity editing, sports or action aesthetic, fluid motion maintenance',
    category: 'Transitions',
    tool: 'Runway',
    tags: ['action', 'cut', 'clean', 'fluid'],
    is_premium: false
  },

  // PRO TIER - PRODUCT DEMO (5)
  {
    title: '360 Product with Environment',
    prompt: 'Product 360 rotation with environmental context, seamless turntable, lifestyle setting visible in reflections, professional studio with view, ultra-premium aesthetic, 8K commercial quality, brand storytelling',
    category: 'Product Demo',
    tool: 'Runway',
    tags: ['product', '360', 'environment', 'premium'],
    is_premium: true
  },
  {
    title: 'Product Explosion Assembly',
    prompt: 'Dynamic product explosion view showing all components, parts floating and assembling, technical aesthetic, engineering focus, smooth motion, product design showcase, instructional yet cinematic',
    category: 'Product Demo',
    tool: 'Pika',
    tags: ['product', 'exploded', 'technical', 'assembly'],
    is_premium: true
  },
  {
    title: 'Food Product Steam Shot',
    prompt: 'Steaming hot food product, appetizing lighting, steam rising naturally, shallow depth of field on hero dish, professional food photography style, warm inviting colors, culinary commercial aesthetic',
    category: 'Product Demo',
    tool: 'Runway',
    tags: ['food', 'steam', 'appetizing', 'culinary'],
    is_premium: true
  },
  {
    title: 'Cosmetics Swatch Motion',
    prompt: 'Beauty product swatches spreading smoothly, satisfying motion, color gradients forming, cosmetics commercial style, soft feminine lighting, texture focus, premium beauty brand aesthetic',
    category: 'Product Demo',
    tool: 'Pika',
    tags: ['beauty', 'cosmetics', 'swatch', 'texture'],
    is_premium: true
  },
  {
    title: 'Tech Product Unfold',
    prompt: 'Futuristic tech product unfolding or transforming, sleek animation, cyberpunk lighting accents, innovative reveal, sci-fi aesthetic, cutting-edge technology showcase, dramatic lighting',
    category: 'Product Demo',
    tool: 'Runway',
    tags: ['tech', 'transform', 'futuristic', 'sci-fi'],
    is_premium: true
  },

  // PRO TIER - B-ROLL (5)
  {
    title: 'Hyperlapse Urban Motion',
    prompt: 'Smooth hyperlapse through urban environment, time compression effect, dynamic motion blur, city energy, architectural focus, professional travel videography, fast yet smooth movement, 4K',
    category: 'B-Roll',
    tool: 'Pika',
    tags: ['hyperlapse', 'urban', 'time', 'dynamic'],
    is_premium: true
  },
  {
    title: 'Underwater Follow Shot',
    prompt: 'Smooth underwater camera movement, following subject swimming, natural caustic light patterns, blue water tones, documentary ocean aesthetic, weightless feel, aquatic life or human subject',
    category: 'B-Roll',
    tool: 'Runway',
    tags: ['underwater', 'aquatic', 'blue', 'weightless'],
    is_premium: true
  },
  {
    title: 'POV Adventure Shot',
    prompt: 'First-person POV action shot, immersive perspective, GoPro aesthetic but cinematic, adventure sports or exploration, dynamic movement, adrenaline feel, wide angle lens distortion',
    category: 'B-Roll',
    tool: 'Pika',
    tags: ['pov', 'action', 'adventure', 'immersive'],
    is_premium: true
  },
  {
    title: 'Slow Motion Detail',
    prompt: 'Dramatic slow motion detail shot, water droplet, powder explosion, or fabric movement, high frame rate aesthetic, elegant motion, macro detail, artistic commercial style, temporal stretching',
    category: 'B-Roll',
    tool: 'Runway',
    tags: ['slowmo', 'detail', 'elegant', 'artistic'],
    is_premium: true
  },
  {
    title: 'Drone Orbit Shot',
    prompt: 'Cinematic drone orbiting subject, perfect circular motion, subject centered, background rotating, dramatic reveal of landscape, professional aerial cinematography, 4K quality, epic scale',
    category: 'B-Roll',
    tool: 'Pika',
    tags: ['drone', 'orbit', 'epic', 'reveal'],
    is_premium: true
  },

  // PRO TIER - INTERVIEW (5)
  {
    title: 'Walk-and-Talk Interview',
    prompt: 'Dynamic walk-and-talk interview, two subjects moving through environment, steady gimbal follow, natural conversation energy, Aaron Sorkin style, professional TV aesthetic, engaging movement',
    category: 'Interview',
    tool: 'Runway',
    tags: ['walk', 'talk', 'dynamic', 'conversation'],
    is_premium: true
  },
  {
    title: 'Car Interior Interview',
    prompt: 'Cinematic car interior interview, soft practical lighting from dashboard, subject profile view, shallow depth of field through window, night city lights in background, moody atmospheric feel',
    category: 'Interview',
    tool: 'Pika',
    tags: ['car', 'interior', 'night', 'moody'],
    is_premium: true
  },
  {
    title: 'Vintage Film Interview',
    prompt: '16mm film aesthetic interview, warm color grade, film grain texture, vintage lens distortion, retro documentary style, nostalgic feel, slightly soft focus, period piece aesthetic',
    category: 'Interview',
    tool: 'Runway',
    tags: ['vintage', 'film', '16mm', 'retro'],
    is_premium: true
  },
  {
    title: 'Outdoor Golden Hour Interview',
    prompt: 'Outdoor interview during golden hour, natural backlight creating rim lighting, subject in shade with sun behind, cinematic glow, documentary field aesthetic, warm sunset tones, environmental context',
    category: 'Interview',
    tool: 'Pika',
    tags: ['outdoor', 'golden', 'sunset', 'natural'],
    is_premium: true
  },
  {
    title: 'Three-Panel Split Interview',
    prompt: 'Creative three-panel split screen interview, different angles of same subject, artistic composition, experimental documentary style, editorial aesthetic, modern art direction, magazine feel',
    category: 'Interview',
    tool: 'Runway',
    tags: ['split', 'artistic', 'experimental', 'editorial'],
    is_premium: true
  },

  // PRO TIER - MOTION GRAPHICS (5)
  {
    title: 'Kinetic Typography',
    prompt: 'Dynamic kinetic typography animation, text forming and transforming, bold graphic design, music video aesthetic, sync to rhythm, energetic motion, modern editorial style, striking visuals',
    category: 'Motion Graphics',
    tool: 'Pika',
    tags: ['typography', 'kinetic', 'bold', 'energy'],
    is_premium: true
  },
  {
    title: 'Liquid Morph Transition',
    prompt: 'Smooth liquid morphing transition between shapes, satisfying fluid motion, glossy surface reflections, 3D aesthetic, organic movement, premium motion design, seamless loop potential',
    category: 'Motion Graphics',
    tool: 'Runway',
    tags: ['liquid', 'morph', 'transition', 'satisfying'],
    is_premium: true
  },
  {
    title: 'Holographic Interface',
    prompt: 'Futuristic holographic UI elements, sci-fi heads-up display, transparent layers, cyan and magenta accents, tech aesthetic, Iron Man style interface, data visualization, cyberpunk feel',
    category: 'Motion Graphics',
    tool: 'Pika',
    tags: ['hologram', 'ui', 'scifi', 'tech'],
    is_premium: true
  },
  {
    title: 'Paper Cutout Animation',
    prompt: 'Charming paper cutout animation style, layered 2D aesthetic, handmade craft feel, stop motion influence, warm friendly colors, explainer video style, accessible and engaging',
    category: 'Motion Graphics',
    tool: 'Runway',
    tags: ['paper', 'cutout', 'craft', 'charming'],
    is_premium: true
  },
  {
    title: 'Neon Cyberpunk Loop',
    prompt: 'Pulsing neon lights in cyberpunk setting, synthwave aesthetic, purple and pink gradients, urban night environment, retro-futuristic, music visualizer feel, endless loop, 80s inspired',
    category: 'Motion Graphics',
    tool: 'Pika',
    tags: ['neon', 'cyberpunk', 'synthwave', 'loop'],
    is_premium: true
  },

  // PRO TIER - TRANSITIONS (5)
  {
    title: 'Glass Shatter Reveal',
    prompt: 'Dramatic glass shatter revealing next scene, crystalline breaking effect, slow motion shards, cinematic impact, action movie aesthetic, dynamic destruction, sharp details',
    category: 'Transitions',
    tool: 'Pika',
    tags: ['shatter', 'glass', 'dramatic', 'impact'],
    is_premium: true
  },
  {
    title: 'Ink Bleed Transition',
    prompt: 'Organic ink bleed spreading across frame, fluid artistic transition, paper texture visible, watercolor aesthetic, gentle yet transformative, creative artistic feel',
    category: 'Transitions',
    tool: 'Runway',
    tags: ['ink', 'bleed', 'organic', 'artistic'],
    is_premium: true
  },
  {
    title: 'Digital Glitch Cut',
    prompt: 'Digital glitch artifact transition, pixel sorting, datamoshing aesthetic, tech error style, cyberpunk influence, modern edgy feel, intentional distortion',
    category: 'Transitions',
    tool: 'Pika',
    tags: ['glitch', 'digital', 'error', 'cyberpunk'],
    is_premium: true
  },
  {
    title: 'Page Turn Effect',
    prompt: 'Physical page turning transition, book or magazine aesthetic, nostalgic feel, paper texture, smooth curl motion, editorial style, storybook charm',
    category: 'Transitions',
    tool: 'Runway',
    tags: ['page', 'turn', 'book', 'nostalgic'],
    is_premium: true
  },
  {
    title: 'Smoke Dissolve',
    prompt: 'Elegant smoke dissolve transition, ethereal and mysterious, soft diffusion, atmospheric effect, cinematic fade, fantasy aesthetic, dreamy quality',
    category: 'Transitions',
    tool: 'Pika',
    tags: ['smoke', 'dissolve', 'ethereal', 'dreamy'],
    is_premium: true
  },

  // PRO TIER - VFX (10)
  {
    title: 'Cinematic Lens Flare',
    prompt: 'Organic anamorphic lens flare streaking across frame, cinematic bloom, JJ Abrams style light leak, realistic optical artifact, sunset or bright source causing flare, film aesthetic',
    category: 'VFX',
    tool: 'Runway',
    tags: ['flare', 'lens', 'anamorphic', 'cinematic'],
    is_premium: true
  },
  {
    title: 'Atmospheric Fog',
    prompt: 'Thick atmospheric fog or mist, moody environment, volumetric lighting through haze, mysterious mood, horror or thriller aesthetic, depth layers, cinematic atmosphere',
    category: 'VFX',
    tool: 'Pika',
    tags: ['fog', 'mist', 'atmosphere', 'moody'],
    is_premium: true
  },
  {
    title: 'Particle Dust Motes',
    prompt: 'Golden hour dust particles floating in light beam, magical atmosphere, visible light rays, cinematic indoor shot, shallow depth of field on particles, ethereal quality',
    category: 'VFX',
    tool: 'Runway',
    tags: ['particles', 'dust', 'light', 'magical'],
    is_premium: true
  },
  {
    title: 'Rain on Lens',
    prompt: 'Rain droplets on camera lens, out of focus water drops in foreground, dramatic background scene, moody weather aesthetic, emotional feel, cinematic storm',
    category: 'VFX',
    tool: 'Pika',
    tags: ['rain', 'lens', 'drops', 'moody'],
    is_premium: true
  },
  {
    title: 'Fire/Smoke Element',
    prompt: 'Realistic fire or smoke element, practical effect aesthetic, warm lighting from flame, organic movement, action or dramatic scene, cinematic color grade, atmospheric enhancement',
    category: 'VFX',
    tool: 'Runway',
    tags: ['fire', 'smoke', 'practical', 'dramatic'],
    is_premium: true
  },
  {
    title: 'Slow Motion Rain',
    prompt: 'Heavy rain in dramatic slow motion, individual droplets visible, moody atmospheric lighting, noir aesthetic, melancholic feel, cinematic weather, temporal manipulation',
    category: 'VFX',
    tool: 'Pika',
    tags: ['rain', 'slowmo', 'noir', 'melancholic'],
    is_premium: true
  },
  {
    title: 'Hologram Projection',
    prompt: 'Holographic projection effect, translucent blue figure, sci-fi aesthetic, futuristic interface, glowing edges, digital artifact noise, Blade Runner influence, tech noir',
    category: 'VFX',
    tool: 'Runway',
    tags: ['hologram', 'projection', 'scifi', 'future'],
    is_premium: true
  },
  {
    title: 'Time Slice/Bullet Time',
    prompt: 'Frozen moment with camera moving through scene, Matrix bullet time aesthetic, temporal freeze, 3D spatial movement, suspended objects, dramatic action frozen, cinematic spectacle',
    category: 'VFX',
    tool: 'Pika',
    tags: ['time', 'freeze', 'bullet', 'spectacle'],
    is_premium: true
  },
  {
    title: 'Double Exposure Effect',
    prompt: 'Artistic double exposure, two scenes blended, silhouette with landscape inside, editorial photography style, emotional metaphor, artistic montage, creative visual storytelling',
    category: 'VFX',
    tool: 'Runway',
    tags: ['double', 'exposure', 'artistic', 'metaphor'],
    is_premium: true
  },
  {
    title: 'Practical Light Leaks',
    prompt: 'Organic film light leaks, vintage 16mm aesthetic, warm orange and red flashes, corner light bleed, nostalgic film damage, authentic retro feel, analog texture',
    category: 'VFX',
    tool: 'Pika',
    tags: ['light', 'leak', 'vintage', 'film'],
    is_premium: true
  }
]

async function setupDatabase() {
  console.log('Setting up CineWorkflow database...\n')

  try {
    // Clear existing data
    console.log('1. Clearing existing prompts...')
    const { error: deleteError } = await supabase
      .from('prompts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) {
      console.log('   Note:', deleteError.message)
    } else {
      console.log('   ✓ Cleared existing data')
    }

    // Insert all prompts
    console.log('\n2. Inserting 60 prompts...')
    const { data, error } = await supabase
      .from('prompts')
      .insert(prompts)
      .select()

    if (error) {
      console.error('   ✗ Error:', error.message)
      return
    }

    console.log(`   ✓ Inserted ${data.length} prompts`)

    // Verify counts
    console.log('\n3. Verifying database...')
    const { data: counts, error: countError } = await supabase
      .from('prompts')
      .select('is_premium', { count: 'exact' })

    if (countError) {
      console.error('   ✗ Error:', countError.message)
      return
    }

    const freeCount = counts.filter(p => !p.is_premium).length
    const proCount = counts.filter(p => p.is_premium).length

    console.log(`   ✓ Free prompts: ${freeCount}`)
    console.log(`   ✓ Pro prompts: ${proCount}`)
    console.log(`   ✓ Total: ${counts.length}`)

    console.log('\n✅ Database setup complete!')

  } catch (err) {
    console.error('Error:', err.message)
  }
}

setupDatabase()
