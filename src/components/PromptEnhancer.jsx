import { useState } from 'react';
import { Sparkles, Copy, Check, Wand2 } from 'lucide-react';

const MOODS = ["Epic", "Emotional", "Energetic", "Eerie", "Calm", "Surreal"];
const USES = ["Social Media", "Brand Ad", "Short Film", "Background", "Music Video"];
const TOOLS = ["Runway", "Kling", "Sora", "Pika", "Luma", "Veo", "Higgsfield"];

const TOOL_INFO = {
  "Runway": "Best for cinematic control and style consistency.",
  "Kling": "Great for anime, characters, and audio-visual generation.",
  "Sora": "Excels at surreal scenes and complex physics.",
  "Pika": "Fast for social content and VHS aesthetics.",
  "Luma": "Strong on realistic lighting and fluid dynamics.",
  "Veo": "Best all-rounder with native audio generation.",
  "Higgsfield": "Full director's toolkit with camera control.",
};

export default function PromptEnhancer() {
  const [idea, setIdea] = useState("");
  const [mood, setMood] = useState("");
  const [useCase, setUseCase] = useState("");
  const [tool, setTool] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const canSubmit = idea.trim().length > 3 && !loading;

  const handleEnhance = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `Transform this video idea into a professional AI video generation prompt. Be vivid and cinematic, under 60 words.

Idea: "${idea}"
Mood: ${mood || 'Not specified'}
Use case: ${useCase || 'Not specified'}
Tool: ${tool || 'General'}

Format: Just return the enhanced prompt text, nothing else.`
          }]
        })
      });

      const data = await response.json();
      const promptText = data.content?.[0]?.text || data.completion || '';
      setResult(promptText.trim());
    } catch (err) {
      // Fallback demo response
      setResult(`Cinematic ${mood || 'wide'} shot of ${idea}, ${tool || 'professional'} style, soft natural lighting, smooth camera movement, ${useCase || 'high-quality'} production, 4K resolution.`);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Chip = ({ label, selected, onClick, color }) => (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
      style={{
        background: selected ? `${color}15` : 'var(--bg-primary)',
        border: `1.5px solid ${selected ? color : 'var(--border-color)'}`,
        color: selected ? color : 'var(--text-secondary)'
      }}
    >
      {label}
    </button>
  );

  return (
    <section 
      className="py-12 transition-colors relative overflow-hidden"
      style={{ background: 'linear-gradient(90deg, #ECFDF5 0%, var(--bg-primary) 30%, var(--bg-primary) 70%, #E0E7FF 100%)' }}
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
                boxShadow: canSubmit ? '5px 5px 10px rgba(37,99,235,0.25), -5px -5px 10px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.25)' : 'none',
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
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--text-muted)' }} className="text-xs">Mood</span>
              <div className="flex gap-1">
                {MOODS.slice(0, 4).map(m => (
                  <Chip
                    key={m}
                    label={m}
                    selected={mood === m}
                    onClick={() => setMood(mood === m ? '' : m)}
                    color="var(--accent-blue)"
                  />
                ))}
              </div>
            </div>

            {/* Use Case */}
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--text-muted)' }} className="text-xs">Use</span>
              <div className="flex gap-1">
                {USES.slice(0, 3).map(u => (
                  <Chip
                    key={u}
                    label={u}
                    selected={useCase === u}
                    onClick={() => setUseCase(useCase === u ? '' : u)}
                    color="var(--accent-purple)"
                  />
                ))}
              </div>
            </div>

            {/* Tool */}
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--text-muted)' }} className="text-xs">Tool</span>
              <select
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className="px-2 py-1 rounded-lg text-xs outline-none cursor-pointer"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: tool ? 'var(--accent-green)' : 'var(--text-muted)'
                }}
              >
                <option value="">Select...</option>
                {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {tool && TOOL_INFO[tool] && (
            <div 
              className="mt-3 p-2 rounded-lg text-xs inline-block"
              style={{
                background: 'var(--accent-green)10',
                border: '1px solid var(--accent-green)30',
                color: 'var(--accent-green)'
              }}
            >
              💡 {TOOL_INFO[tool]}
            </div>
          )}
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
