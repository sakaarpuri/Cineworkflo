import { useState } from 'react';
import { Sparkles, Copy, Check, Wand2 } from 'lucide-react';

const MOODS = ["Epic / Cinematic", "Emotional / Quiet", "Energetic / Hype", "Eerie / Dark", "Calm / Peaceful", "Surreal / Dreamy"];
const USES = ["Social Media / Reels", "Brand Ad", "Short Film", "Background / Loop", "Music Video", "Presentation"];
const TOOLS = ["Runway", "Kling", "Sora", "Pika", "Luma", "Google Veo", "Higgsfield"];

const TOOL_INFO = {
  "Runway": "Best for cinematic control and style consistency.",
  "Kling": "Great for anime, characters, and audio-visual generation.",
  "Sora": "Excels at surreal scenes and complex physics.",
  "Pika": "Fast for social content and VHS aesthetics.",
  "Luma": "Strong on realistic lighting and fluid dynamics.",
  "Google Veo": "Best all-rounder with native audio generation.",
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
      console.error('Enhancement failed:', err);
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
      className="px-4 py-2 rounded-full text-sm font-medium transition-all"
      style={{
        background: selected ? `${color}15` : 'var(--bg-primary)',
        border: `1.5px solid ${selected ? color : 'var(--border-color)'}`,
        color: selected ? color : 'var(--text-secondary)',
        boxShadow: selected ? 'none' : '2px 2px 4px rgba(0,0,0,0.05), -2px -2px 4px rgba(255,255,255,0.5)'
      }}
    >
      {label}
    </button>
  );

  return (
    <section 
      className="py-20 transition-colors"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider mb-6"
            style={{ 
              background: 'var(--accent-blue)15',
              border: '1px solid var(--accent-blue)30',
              color: 'var(--accent-blue)'
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI PROMPT ENHANCER
          </div>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Describe your idea.
            <br />
            <span style={{ color: 'var(--accent-blue)' }}>
              We'll write the perfect prompt.
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Just tell us what you're imagining — we'll turn it into a detailed, tool-ready prompt.
          </p>
        </div>

        {/* Main Card */}
        <div 
          className="p-8 rounded-2xl"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-color)'
          }}
        >
          {/* Idea Input */}
          <div className="mb-8">
            <label 
              className="block text-sm font-semibold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Describe your video idea
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. a car driving through a neon-lit city at night, a serene mountain landscape at sunrise..."
              rows={3}
              className="w-full p-4 rounded-xl resize-none transition-all outline-none"
              style={{
                background: 'var(--bg-primary)',
                border: '2px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Optional Fields */}
          <div 
            className="flex items-center gap-4 mb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs font-semibold tracking-wider uppercase">
              Refine Your Result — Optional
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          </div>

          {/* Mood */}
          <div className="mb-6">
            <label 
              className="block text-sm font-medium mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              What's the mood?
            </label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
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
          <div className="mb-6">
            <label 
              className="block text-sm font-medium mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              Where will you use it?
            </label>
            <div className="flex flex-wrap gap-2">
              {USES.map(u => (
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
          <div className="mb-8">
            <label 
              className="block text-sm font-medium mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              Which AI tool?
            </label>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map(t => (
                <Chip
                  key={t}
                  label={t}
                  selected={tool === t}
                  onClick={() => setTool(tool === t ? '' : t)}
                  color="var(--accent-green)"
                />
              ))}
            </div>
            {tool && TOOL_INFO[tool] && (
              <div 
                className="mt-3 p-3 rounded-lg text-sm"
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

          {/* Submit Button */}
          <button
            onClick={handleEnhance}
            disabled={!canSubmit}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
            style={{
              background: canSubmit ? 'var(--accent-blue)' : 'var(--border-color)',
              color: canSubmit ? '#fff' : 'var(--text-muted)',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              boxShadow: canSubmit ? '0 4px 14px rgba(37,99,235,0.35)' : 'none'
            }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                ✨ Enhance My Prompt
              </>
            )}
          </button>

          {idea.trim().length <= 3 && (
            <p 
              className="text-center text-sm mt-4"
              style={{ color: 'var(--text-muted)' }}
            >
              Describe your idea above — the rest is optional
            </p>
          )}
        </div>

        {/* Result */}
        {result && (
          <div 
            className="mt-8 p-8 rounded-2xl animate-fade-in"
            style={{
              background: 'var(--bg-secondary)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--accent-green)40'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="flex items-center gap-2 text-sm font-bold"
                style={{ color: 'var(--accent-green)' }}
              >
                <Check className="h-4 w-4" />
                ENHANCED PROMPT READY
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: copied ? 'var(--accent-green)' : 'var(--bg-primary)',
                  color: copied ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {copied ? (
                  <><Check className="h-4 w-4" /> Copied</>
                ) : (
                  <><Copy className="h-4 w-4" /> Copy</>
                )}
              </button>
            </div>
            <p 
              className="text-lg leading-relaxed italic"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
            >
              "{result}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
