-- 50+ Professional AI Video Prompts for CineWorkflow
-- Free tier prompts (25) + Pro tier prompts (25+)
-- Run this in Supabase SQL Editor

-- Clear existing data
TRUNCATE prompts RESTART IDENTITY;

-- FREE TIER PROMPTS (25 prompts)
INSERT INTO prompts (title, prompt, category, tool, tags, is_premium) VALUES

-- PRODUCT DEMO (5 free)
('Cinematic Product Rotation', 
 'Cinematic product shot, rotating 360° on seamless black background, studio lighting with soft reflections, shallow depth of field, 8K quality, motion blur on rotation, professional commercial aesthetic, clean minimal setup',
 'Product Demo', 'Runway', ARRAY['product', 'commercial', 'rotation', '360'], false),

('Floating Product Showcase', 
 'Elegant product floating in mid-air, zero gravity effect, soft studio lighting from above, subtle shadows on white surface, minimalist aesthetic, premium brand feel, shallow depth of field, 4K commercial quality',
 'Product Demo', 'Pika', ARRAY['product', 'floating', 'minimal', 'premium'], false),

('Product Unboxing Motion', 
 'Smooth hands opening premium product packaging, overhead angle, soft natural lighting, anticipation building, reveal moment, unboxing experience, social media style, shallow depth of field on product',
 'Product Demo', 'Runway', ARRAY['product', 'unboxing', 'hands', 'social'], false),

('Luxury Product Detail Shot', 
 'Extreme close-up of luxury product texture, macro lens effect, dramatic side lighting creating highlights on metallic surface, shallow depth of field, premium craftsmanship focus, cinematic mood',
 'Product Demo', 'Runway', ARRAY['product', 'macro', 'luxury', 'detail'], false),

('Product Lifestyle Context', 
 'Product naturally placed in lifestyle setting, soft morning light through window, authentic environment, subtle hand interacting with product, Instagram aesthetic, warm tones, shallow depth of field',
 'Product Demo', 'Pika', ARRAY['product', 'lifestyle', 'natural', 'warm'], false),

-- B-ROLL (5 free)
('Smooth Aerial Drone Shot', 
 'Aerial drone footage, smooth gliding motion over landscape, golden hour lighting, cinematic color grade, slight lens flare, professional travel documentary style, 4K resolution, sweeping vista',
 'B-Roll', 'Pika', ARRAY['drone', 'landscape', 'travel', 'aerial'], false),

('Handheld Documentary Style', 
 'Handheld camera movement, subtle natural shake, following subject through environment, natural lighting, documentary style, authentic feel, slight motion blur on edges, cinéma vérité aesthetic',
 'B-Roll', 'Runway', ARRAY['handheld', 'documentary', 'natural', 'authentic'], false),

('Gimbal Walking Shot', 
 'Smooth gimbal stabilized walking shot, following subject from behind, urban environment, shallow depth of field, cinematic motion, professional music video aesthetic, golden hour lighting',
 'B-Roll', 'Pika', ARRAY['gimbal', 'walking', 'urban', 'smooth'], false),

('Establishing Wide Shot', 
 'Wide establishing shot of location, slow push-in movement, dramatic sky, sense of scale, cinematic composition, professional film opening aesthetic, 4K quality, epic feel',
 'B-Roll', 'Runway', ARRAY['wide', 'establishing', 'epic', 'scale'], false),

('Close-Up Detail B-Roll', 
 'Intimate close-up shots, shallow depth of field, hands working on craft, texture focus, warm natural lighting, documentary style, emotional connection, professional color grade',
 'B-Roll', 'Pika', ARRAY['closeup', 'detail', 'hands', 'craft'], false),

-- INTERVIEW (5 free)
('Dramatic Lighting Portrait', 
 'Dramatic interview lighting, Rembrandt style with triangle highlight on cheek, subject looking slightly off-camera, shallow depth of field, film grain texture, cinematic mood, dark background with rim light separation',
 'Interview', 'Runway', ARRAY['interview', 'portrait', 'dramatic', 'rembrandt'], false),

('Clean Corporate Interview', 
 'Clean professional interview setup, soft even lighting, neutral background, subject centered, broadcast quality, corporate documentary style, sharp focus, professional headshot aesthetic',
 'Interview', 'Pika', ARRAY['interview', 'corporate', 'clean', 'professional'], false),

('Natural Window Light Interview', 
 'Natural window light interview, soft diffused lighting on subject, environmental background showing context, authentic feel, documentary style, shallow depth of field, warm tones',
 'Interview', 'Runway', ARRAY['interview', 'natural', 'window', 'authentic'], false),

('Silhouette Interview', 
 'Dramatic silhouette of subject against bright background, rim lighting creating edge separation, mysterious mood, subject gesturing, cinematic interview style, high contrast',
 'Interview', 'Pika', ARRAY['interview', 'silhouette', 'dramatic', 'moody'], false),

('Two-Person Interview Setup', 
 'Two-shot interview framing, both subjects in frame, professional lighting on both, shallow depth of field, over-shoulder angle option, broadcast documentary style, engaging conversation feel',
 'Interview', 'Runway', ARRAY['interview', 'two-shot', 'conversation', 'broadcast'], false),

-- MOTION GRAPHICS (5 free)
('Seamless Loop Background', 
 'Abstract flowing particles, seamless loop animation, soft gradients in teal and coral, gentle organic motion, perfect for text overlay, 4K, smooth 60fps, corporate presentation aesthetic',
 'Motion Graphics', 'Runway', ARRAY['background', 'loop', 'abstract', 'particles'], false),

('Cinematic Title Background', 
 'Dramatic cinematic background for titles, subtle smoke or fog, moody lighting, dark tones with accent color, film grain texture, perfect for opening credits, epic feel',
 'Motion Graphics', 'Pika', ARRAY['titles', 'background', 'cinematic', 'moody'], false),

('Data Visualization Motion', 
 'Clean data visualization motion graphics, bar charts growing, numbers counting up, tech aesthetic, blue and white color scheme, corporate style, smooth animations, professional presentation',
 'Motion Graphics', 'Runway', ARRAY['data', 'charts', 'corporate', 'tech'], false),

('Social Media Text Background', 
 'Vibrant background for social media text, trending gradient colors, subtle motion, youth aesthetic, Instagram/TikTok style, energetic feel, 9:16 vertical format optimized',
 'Motion Graphics', 'Pika', ARRAY['social', 'background', 'trending', 'vertical'], false),

('Logo Reveal Animation', 
 'Professional logo reveal, elegant animation, particle effects forming logo, corporate style, clean background, smooth motion, premium brand introduction, 4K quality',
 'Motion Graphics', 'Runway', ARRAY['logo', 'reveal', 'corporate', 'elegant'], false);

-- PRO TIER PROMPTS (25+ prompts)
INSERT INTO prompts (title, prompt, category, tool, tags, is_premium) VALUES

-- PRODUCT DEMO PRO (5)
('360 Product with Environment', 
 'Product 360 rotation with environmental context, seamless turntable, lifestyle setting visible in reflections, professional studio with view, ultra-premium aesthetic, 8K commercial quality, brand storytelling',
 'Product Demo', 'Runway', ARRAY['product', '360', 'environment', 'premium'], true),

('Product Explosion Assembly', 
 'Dynamic product explosion view showing all components, parts floating and assembling, technical aesthetic, engineering focus, smooth motion, product design showcase, instructional yet cinematic',
 'Product Demo', 'Pika', ARRAY['product', 'exploded', 'technical', 'assembly'], true),

('Food Product Steam Shot', 
 'Steaming hot food product, appetizing lighting, steam rising naturally, shallow depth of field on hero dish, professional food photography style, warm inviting colors, culinary commercial aesthetic',
 'Product Demo', 'Runway', ARRAY['food', 'steam', 'appetizing', 'culinary'], true),

('Cosmetics Swatch Motion', 
 'Beauty product swatches spreading smoothly, satisfying motion, color gradients forming, cosmetics commercial style, soft feminine lighting, texture focus, premium beauty brand aesthetic',
 'Product Demo', 'Pika', ARRAY['beauty', 'cosmetics', 'swatch', 'texture'], true),

('Tech Product Unfold', 
 'Futuristic tech product unfolding or transforming, sleek animation, cyberpunk lighting accents, innovative reveal, sci-fi aesthetic, cutting-edge technology showcase, dramatic lighting',
 'Product Demo', 'Runway', ARRAY['tech', 'transform', 'futuristic', 'sci-fi'], true),

-- B-ROLL PRO (5)
('Hyperlapse Urban Motion', 
 'Smooth hyperlapse through urban environment, time compression effect, dynamic motion blur, city energy, architectural focus, professional travel videography, fast yet smooth movement, 4K',
 'B-Roll', 'Pika', ARRAY['hyperlapse', 'urban', 'time', 'dynamic'], true),

('Underwater Follow Shot', 
 'Smooth underwater camera movement, following subject swimming, natural caustic light patterns, blue water tones, documentary ocean aesthetic, weightless feel, aquatic life or human subject',
 'B-Roll', 'Runway', ARRAY['underwater', 'aquatic', 'blue', 'weightless'], true),

('POV Adventure Shot', 
 'First-person POV action shot, immersive perspective, GoPro aesthetic but cinematic, adventure sports or exploration, dynamic movement, adrenaline feel, wide angle lens distortion',
 'B-Roll', 'Pika', ARRAY['pov', 'action', 'adventure', 'immersive'], true),

('Slow Motion Detail', 
 'Dramatic slow motion detail shot, water droplet, powder explosion, or fabric movement, high frame rate aesthetic, elegant motion, macro detail, artistic commercial style, temporal stretching',
 'B-Roll', 'Runway', ARRAY['slowmo', 'detail', 'elegant', 'artistic'], true),

('Drone Orbit Shot', 
 'Cinematic drone orbiting subject, perfect circular motion, subject centered, background rotating, dramatic reveal of landscape, professional aerial cinematography, 4K quality, epic scale',
 'B-Roll', 'Pika', ARRAY['drone', 'orbit', 'epic', 'reveal'], true),

-- INTERVIEW PRO (5)
('Walk-and-Talk Interview', 
 'Dynamic walk-and-talk interview, two subjects moving through environment, steady gimbal follow, natural conversation energy, Aaron Sorkin style, professional TV aesthetic, engaging movement',
 'Interview', 'Runway', ARRAY['walk', 'talk', 'dynamic', 'conversation'], true),

('Car Interior Interview', 
 'Cinematic car interior interview, soft practical lighting from dashboard, subject profile view, shallow depth of field through window, night city lights in background, moody atmospheric feel',
 'Interview', 'Pika', ARRAY['car', 'interior', 'night', 'moody'], true),

('Vintage Film Interview', 
 '16mm film aesthetic interview, warm color grade, film grain texture, vintage lens distortion, retro documentary style, nostalgic feel, slightly soft focus, period piece aesthetic',
 'Interview', 'Runway', ARRAY['vintage', 'film', '16mm', 'retro'], true),

('Outdoor Golden Hour Interview', 
 'Outdoor interview during golden hour, natural backlight creating rim lighting, subject in shade with sun behind, cinematic glow, documentary field aesthetic, warm sunset tones, environmental context',
 'Interview', 'Pika', ARRAY['outdoor', 'golden', 'sunset', 'natural'], true),

('Three-Panel Split Interview', 
 'Creative three-panel split screen interview, different angles of same subject, artistic composition, experimental documentary style, editorial aesthetic, modern art direction, magazine feel',
 'Interview', 'Runway', ARRAY['split', 'artistic', 'experimental', 'editorial'], true),

-- MOTION GRAPHICS PRO (5)
('Kinetic Typography', 
 'Dynamic kinetic typography animation, text forming and transforming, bold graphic design, music video aesthetic, sync to rhythm, energetic motion, modern editorial style, striking visuals',
 'Motion Graphics', 'Pika', ARRAY['typography', 'kinetic', 'bold', 'energy'], true),

('Liquid Morph Transition', 
 'Smooth liquid morphing transition between shapes, satisfying fluid motion, glossy surface reflections, 3D aesthetic, organic movement, premium motion design, seamless loop potential',
 'Motion Graphics', 'Runway', ARRAY['liquid', 'morph', 'transition', 'satisfying'], true),

('Holographic Interface', 
 'Futuristic holographic UI elements, sci-fi heads-up display, transparent layers, cyan and magenta accents, tech aesthetic, Iron Man style interface, data visualization, cyberpunk feel',
 'Motion Graphics', 'Pika', ARRAY['hologram', 'ui', 'scifi', 'tech'], true),

('Paper Cutout Animation', 
 'Charming paper cutout animation style, layered 2D aesthetic, handmade craft feel, stop motion influence, warm friendly colors, explainer video style, accessible and engaging',
 'Motion Graphics', 'Runway', ARRAY['paper', 'cutout', 'craft', 'charming'], true),

('Neon Cyberpunk Loop', 
 'Pulsing neon lights in cyberpunk setting, synthwave aesthetic, purple and pink gradients, urban night environment, retro-futuristic, music visualizer feel, endless loop, 80s inspired',
 'Motion Graphics', 'Pika', ARRAY['neon', 'cyberpunk', 'synthwave', 'loop'], true);

-- TRANSITIONS (5 free + 5 pro)
INSERT INTO prompts (title, prompt, category, tool, tags, is_premium) VALUES

('Smooth Whip Pan', 
 'Fast whip pan transition, motion blur streaking across frame, energetic direction change, music video style, dynamic energy, seamless cut point, professional editing aesthetic',
 'Transitions', 'Runway', ARRAY['whip', 'pan', 'fast', 'energy'], false),

('Match Cut Frame', 
 'Match cut on similar shapes or colors between two scenes, visual continuity, editorial precision, clever transition, professional film editing, satisfying connection, artistic flow',
 'Transitions', 'Pika', ARRAY['match', 'cut', 'continuity', 'editorial'], false),

('Fade to Black Dramatic', 
 'Slow dramatic fade to black, emotional beat, cinematic pause, film ending aesthetic, intentional timing, melancholy or reflective mood, professional color grade to black',
 'Transitions', 'Runway', ARRAY['fade', 'black', 'dramatic', 'emotional'], false),

('Zoom Blur Transition', 
 'Quick zoom with radial blur transition, disorienting yet energetic, warp speed effect, dynamic movement, action sequence style, high energy cut, music video aesthetic',
 'Transitions', 'Pika', ARRAY['zoom', 'blur', 'radial', 'energy'], false),

('Clean Cut on Action', 
 'Clean cut on peak action moment, movement carrying across cut, invisible transition, professional continuity editing, sports or action aesthetic, fluid motion maintenance',
 'Transitions', 'Runway', ARRAY['action', 'cut', 'clean', 'fluid'], false),

-- PRO TRANSITIONS (5)
('Glass Shatter Reveal', 
 'Dramatic glass shatter revealing next scene, crystalline breaking effect, slow motion shards, cinematic impact, action movie aesthetic, dynamic destruction, sharp details',
 'Transitions', 'Pika', ARRAY['shatter', 'glass', 'dramatic', 'impact'], true),

('Ink Bleed Transition', 
 'Organic ink bleed spreading across frame, fluid artistic transition, paper texture visible, watercolor aesthetic, gentle yet transformative, creative artistic feel',
 'Transitions', 'Runway', ARRAY['ink', 'bleed', 'organic', 'artistic'], true),

('Digital Glitch Cut', 
 'Digital glitch artifact transition, pixel sorting, datamoshing aesthetic, tech error style, cyberpunk influence, modern edgy feel, intentional distortion',
 'Transitions', 'Pika', ARRAY['glitch', 'digital', 'error', 'cyberpunk'], true),

('Page Turn Effect', 
 'Physical page turning transition, book or magazine aesthetic, nostalgic feel, paper texture, smooth curl motion, editorial style, storybook charm',
 'Transitions', 'Runway', ARRAY['page', 'turn', 'book', 'nostalgic'], true),

('Smoke Dissolve', 
 'Elegant smoke dissolve transition, ethereal and mysterious, soft diffusion, atmospheric effect, cinematic fade, fantasy aesthetic, dreamy quality',
 'Transitions', 'Pika', ARRAY['smoke', 'dissolve', 'ethereal', 'dreamy'], true);

-- EFFECTS & VFX (10 prompts - all pro)
INSERT INTO prompts (title, prompt, category, tool, tags, is_premium) VALUES

('Cinematic Lens Flare', 
 'Organic anamorphic lens flare streaking across frame, cinematic bloom, JJ Abrams style light leak, realistic optical artifact, sunset or bright source causing flare, film aesthetic',
 'VFX', 'Runway', ARRAY['flare', 'lens', 'anamorphic', 'cinematic'], true),

('Atmospheric Fog', 
 'Thick atmospheric fog or mist, moody environment, volumetric lighting through haze, mysterious mood, horror or thriller aesthetic, depth layers, cinematic atmosphere',
 'VFX', 'Pika', ARRAY['fog', 'mist', 'atmosphere', 'moody'], true),

('Particle Dust Motes', 
 'Golden hour dust particles floating in light beam, magical atmosphere, visible light rays, cinematic indoor shot, shallow depth of field on particles, ethereal quality',
 'VFX', 'Runway', ARRAY['particles', 'dust', 'light', 'magical'], true),

('Rain on Lens', 
 'Rain droplets on camera lens, out of focus water drops in foreground, dramatic background scene, moody weather aesthetic, emotional feel, cinematic storm',
 'VFX', 'Pika', ARRAY['rain', 'lens', 'drops', 'moody'], true),

('Fire/Smoke Element', 
 'Realistic fire or smoke element, practical effect aesthetic, warm lighting from flame, organic movement, action or dramatic scene, cinematic color grade, atmospheric enhancement',
 'VFX', 'Runway', ARRAY['fire', 'smoke', 'practical', 'dramatic'], true),

('Slow Motion Rain', 
 'Heavy rain in dramatic slow motion, individual droplets visible, moody atmospheric lighting, noir aesthetic, melancholic feel, cinematic weather, temporal manipulation',
 'VFX', 'Pika', ARRAY['rain', 'slowmo', 'noir', 'melancholic'], true),

('Hologram Projection', 
 'Holographic projection effect, translucent blue figure, sci-fi aesthetic, futuristic interface, glowing edges, digital artifact noise, Blade Runner influence, tech noir',
 'VFX', 'Runway', ARRAY['hologram', 'projection', 'scifi', 'future'], true),

('Time Slice/Bullet Time', 
 'Frozen moment with camera moving through scene, Matrix bullet time aesthetic, temporal freeze, 3D spatial movement, suspended objects, dramatic action frozen, cinematic spectacle',
 'VFX', 'Pika', ARRAY['time', 'freeze', 'bullet', 'spectacle'], true),

('Double Exposure Effect', 
 'Artistic double exposure, two scenes blended, silhouette with landscape inside, editorial photography style, emotional metaphor, artistic montage, creative visual storytelling',
 'VFX', 'Runway', ARRAY['double', 'exposure', 'artistic', 'metaphor'], true),

('Practical Light Leaks', 
 'Organic film light leaks, vintage 16mm aesthetic, warm orange and red flashes, corner light bleed, nostalgic film damage, authentic retro feel, analog texture',
 'VFX', 'Pika', ARRAY['light', 'leak', 'vintage', 'film'], true);

-- Verify count
SELECT 
  COUNT(*) as total_prompts,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as free_prompts,
  COUNT(CASE WHEN is_premium = true THEN 1 END) as pro_prompts
FROM prompts;
