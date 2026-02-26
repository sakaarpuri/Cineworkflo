import { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Wand2 } from 'lucide-react';

const MOODS = ["Epic", "Dramatic", "Thought-Provoking", "Whimsical", "Serene", "Mysterious", "Energetic", "Eerie", "Calm", "Surreal", "Hopeful", "Melancholic", "Tense", "Playful", "Dreamlike"];
const MOOD_COLORS = {
  "Epic": "#8B5CF6",
  "Dramatic": "#EC4899",
  "Thought-Provoking": "#F59E0B",
  "Whimsical": "#10B981",
  "Serene": "#06B6D4",
  "Mysterious": "#6366F1",
  "Energetic": "#FF7043",
  "Eerie": "#B0BEC5",
  "Calm": "#4CAF50",
  "Surreal": "#9C27B0",
  "Hopeful": "#FFC107",
  "Melancholic": "#607D8B",
  "Tense": "#F44336",
  "Playful": "#FFEB3B",
  "Dreamlike": "#9575CD"
};
const USES = ["Storytelling", "Short-form Content", "Product Showcase", "Concept Art", "Music Visualizer", "Education", "Explainer Video", "Social Media", "Brand Ad", "Short Film", "Background", "Music Video", "Documentary", "Experimental", "Gaming Cinematic"];
const USE_COLORS = {
  "Storytelling": "#3B82F6",
  "Short-form Content": "#F59E0B",
  "Product Showcase": "#8B5CF6",
  "Concept Art": "#10B981",
  "Music Visualizer": "#06B6D4",
  "Education": "#6366F1",
  "Explainer Video": "#FF7043",
  "Social Media": "#4CAF50",
  "Brand Ad": "#FFC107",
  "Short Film": "#2196F3",
  "Background": "#FF9800",
  "Music Video": "#E91E63",
  "Documentary": "#795548",
  "Experimental": "#00BCD4",
  "Gaming Cinematic": "#424242"
};

export default function PromptEnhancer() {
  const [idea, setIdea] = useState("");
  const [mood, setMood] = useState("");
  const [useCase, setUseCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

  const canSubmit = idea.trim().length > 3 && !loading;

  const handleEnhance = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch('/.netlify/functions/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, mood, useCase })
      });

      const data = await response.json();
      setResult(data.prompt || `Cinematic ${mood || 'wide'} shot of ${idea}, soft natural lighting, smooth camera movement, ${useCase || 'high-quality'} production, 4K resolution.`);
      setHasGeneratedOnce(true);
    } catch (err) {
      // Fallback demo response
      setResult(`Cinematic ${mood || 'wide'} shot of ${idea}, soft natural lighting, smooth camera movement, ${useCase || 'high-quality'} production, 4K resolution.`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (hasGeneratedOnce && canSubmit) {
      const timeoutId = setTimeout(() => {
        handleEnhance();
      }, 500); // Debounce for 500ms
      return () => clearTimeout(timeoutId);
    }
  }, [mood, useCase, idea, hasGeneratedOnce, canSubmit]); // Depend on relevant states


  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Chip = ({ label, selected, onClick, color }) => (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap"
      style={{
        background: selected 
          ? `linear-gradient(145deg, ${color}, ${color}DD)` 
          : 'var(--bg-primary)',
        border: `2px solid ${selected ? color + '60' : 'var(--border-color)'}`,
        color: selected ? '#fff' : 'var(--text-secondary)',
        boxShadow: selected 
          ? `inset 2px 2px 4px ${color}80, inset -2px -2px 4px rgba(255,255,255,0.3), 0 3px 8px ${color}50` 
          : '4px 4px 8px rgba(0,0,0,0.08), -4px -4px 8px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
        transform: selected ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
      }}
    >
      {label}
    </button>
  );

  return (
    <section 
      className="py-12 transition-colors relative overflow-hidden"
      style={{ background: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--bg-primary) 30%, var(--bg-primary) 70%, var(--bg-secondary) 100%)' }}
    >
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 transform -translate-y-1/2" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3"
            style={{ 
              background: 'var(--accent-blue)15',
              border: '1px solid var(--accent-blue)30',
              color: 'var(--accent-blue)'
            }}
          >
            <Sparkles className="h-3 w-3" />
            AI PROMPT ENHANCER
          </div>
          <h2 
            className="text-2xl md:text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Describe your idea. <span style={{ color: 'var(--accent-blue)' }}>We'll write the prompt.</span>
          </h2>
        </div>

        {/* Wide Compact Card */}
        <div 
          className="p-5 rounded-2xl"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-color)'
          }}
        >
          {/* Main Input Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Idea Input - Takes more space */}
            <div className="flex-1">
              <input
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. a car driving through a neon-lit city at night..."
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Enhance Button */}
            <button
              onClick={handleEnhance}
              disabled={!canSubmit}
              className="px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              style={{
                background: canSubmit ? 'linear-gradient(145deg, #3B82F6, #2563EB)' : 'var(--border-color)',
                color: canSubmit ? '#fff' : 'var(--text-muted)',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                boxShadow: canSubmit 
                  ? '5px 5px 10px rgba(37,99,235,0.25), -5px -5px 10px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.25)'
                  : 'none',
                border: canSubmit ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Wand2 className="h-4 w-4" /> Enhance</>
              )}
            </button>
          </div>

          {/* Options Row - Compact */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Refine:</span>
            
            {/* Mood */}
            <div className="flex flex-col items-start gap-1.5 min-w-0 pr-4">
              <span style={{ color: 'var(--text-muted)' }} className="text-xs flex-shrink-0">Mood</span>
              <div className="flex flex-wrap gap-1.5 overflow-x-auto custom-scroll pr-2">
                {MOODS.map(m => (
                  <Chip
                    key={m}
                    label={m}
                    selected={mood === m}
                    onClick={() => setMood(mood === m ? '' : m)}
                    color={MOOD_COLORS[m]}
                  />
                ))}
              </div>
            </div>

            {/* Use Case */}
            <div className="flex flex-col items-start gap-1.5 min-w-0">
              <span style={{ color: 'var(--text-muted)' }} className="text-xs flex-shrink-0">Use</span>
              <div className="flex flex-wrap gap-1.5 overflow-x-auto custom-scroll pr-2">
                {USES.map(u => (
                  <Chip
                    key={u}
                    label={u}
                    selected={useCase === u}
                    onClick={() => setUseCase(useCase === u ? '' : u)}
                    color={USE_COLORS[u]}
                  />
                ))}
              </div>
            </div>

            {/* Removed Tool Selection */}

          </div>

          {/* Removed Tool-specific info */}

        </div>

        {/* Result - Compact */}
        {result && (
          <div 
            className="mt-4 p-4 rounded-2xl flex items-start gap-4"
            style={{
              background: 'var(--bg-secondary)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--accent-green)40'
            }}
          >
            <div 
              className="text-xs font-bold flex items-center gap-1 flex-shrink-0"
              style={{ color: 'var(--accent-green)' }}
            >
              <Check className="h-3 w-3" />
              RESULT
            </div>
            <p 
              className="flex-1 text-sm leading-relaxed italic"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
            >
              "{result}"
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0"
              style={{
                background: copied ? 'var(--accent-green)' : 'var(--bg-primary)',
                color: copied ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}