import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import type { Correction, CorrectionType } from '../lib/types';
import { Check, X, Loader2, Sparkles, AlertCircle, CheckCheck } from 'lucide-react';
import clsx from 'clsx';

// Improved contrast colors
const typeColors: Record<CorrectionType, string> = {
  spelling: 'bg-red-100 hover:bg-red-200 decoration-red-500/50 underline decoration-wavy text-red-900',
  grammar: 'bg-blue-100 hover:bg-blue-200 decoration-blue-500/50 underline decoration-wavy text-blue-900',
  syntax: 'bg-green-100 hover:bg-green-200 decoration-green-500/50 underline decoration-wavy text-green-900',
  repetition: 'bg-yellow-100 hover:bg-yellow-200 decoration-yellow-500/50 text-yellow-900',
  coherence: 'bg-purple-100 hover:bg-purple-200 decoration-purple-500/50 text-purple-900',
  punctuation: 'bg-pink-100 hover:bg-pink-200 decoration-pink-500/50 text-pink-900',
  style: 'bg-indigo-100 hover:bg-indigo-200 decoration-indigo-500/50 text-indigo-900',
};

const CorrectionTooltip = ({
  correction,
  onApply,
  onIgnore,
  onMouseEnter,
  onMouseLeave
}: {
  correction: Correction;
  onApply: () => void;
  onIgnore: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  return (
    <div
      className="absolute z-5000 bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-72 bg-white rounded-xl shadow-2xl border border-neutral-100 p-4 animate-in fade-in zoom-in-95 duration-150 cursor-default"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200 px-2 py-0.5 rounded-full bg-neutral-50">
          {correction.type}
        </span>
      </div>

      <div className="mb-4">
        <div className="text-neutral-400 text-sm mb-1.5 line-through decoration-neutral-300">
          {correction.original}
        </div>
        <div className="text-neutral-900 font-semibold text-lg leading-tight">
          {correction.suggestion}
        </div>
      </div>

      {correction.message && (
        <p className="text-sm text-neutral-600 mb-4 bg-neutral-50 p-3 rounded-lg border border-neutral-100 leading-snug">
          {correction.message}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onIgnore(); }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <X size={16} />
          Ignorer
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onApply(); }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
        >
          <Check size={16} />
          Appliquer
        </button>
      </div>

      {/* Arrow */}
      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-neutral-100 rotate-45"></div>
    </div>
  );
};

export const Editor = ({ apiKey, onRequireKey }: { apiKey: string, onRequireKey: () => void }) => {
  const {
    text, setText, corrections, isLoading, error,
    analyzeText, applyCorrection, applyAllCorrections, ignoreCorrection
  } = useStore();

  const [mode, setMode] = useState<'edit' | 'review'>('edit');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (corrections.length > 0) {
      setMode('review');
    }
  }, [corrections]);

  const handleAnalyze = () => {
    if (!apiKey) {
      onRequireKey();
      return;
    }
    analyzeText(apiKey);
  };

  const handleMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredId(null);
    }, 300); // 300ms delay to bridge the gap
  };

  const segments = useMemo(() => {
    if (mode === 'edit') return [];

    const sorted = [...corrections].sort((a, b) => a.start - b.start);
    const result = [];
    let lastIndex = 0;

    for (const corr of sorted) {
      if (corr.start < lastIndex) continue;
      if (corr.start >= text.length) break;

      if (corr.start > lastIndex) {
        result.push({
          type: 'text',
          content: text.slice(lastIndex, corr.start),
          id: `text-${lastIndex}`
        });
      }

      result.push({
        type: 'correction',
        data: corr,
        id: corr.id
      });

      lastIndex = corr.end;
    }

    if (lastIndex < text.length) {
      result.push({
        type: 'text',
        content: text.slice(lastIndex),
        id: `text-${lastIndex}`
      });
    }

    return result;
  }, [text, corrections, mode]);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pb-20">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sticky top-6 z-40 gap-4">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md shadow-sm border border-neutral-200 rounded-full px-1.5 py-1.5">
          <button
            onClick={() => setMode('edit')}
            className={clsx(
              "px-5 py-2 rounded-full text-sm font-medium transition-all",
              mode === 'edit'
                ? "bg-neutral-900 text-white shadow-md"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
            )}
          >
            Éditer
          </button>
          <button
            onClick={() => {
              if (corrections.length > 0) setMode('review');
              else if (text.trim()) handleAnalyze();
            }}
            disabled={corrections.length === 0 && !text.trim()}
            className={clsx(
              "px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              mode === 'review'
                ? "bg-neutral-900 text-white shadow-md"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100",
              (corrections.length === 0 && !text.trim()) && "opacity-50 cursor-not-allowed"
            )}
          >
            Revoir
            {corrections.length > 0 && (
              <span className="bg-white text-neutral-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {corrections.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-2">
          {mode === 'review' && corrections.length > 0 && (
            <button
              onClick={applyAllCorrections}
              className="group flex items-center gap-2 bg-white text-neutral-900 border border-neutral-200 px-5 py-2.5 rounded-full font-medium shadow-sm hover:shadow-md hover:bg-neutral-50 transition-all active:scale-95"
            >
              <CheckCheck size={18} className="text-green-600" />
              Tout valider
            </button>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !text.trim()}
            className="group flex items-center gap-2 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Sparkles size={18} className="text-yellow-200 group-hover:rotate-12 transition-transform" />
                {corrections.length > 0 ? 'Relancer' : 'Corriger'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Editor Area */}
      <div className="relative min-h-[60vh] bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 sm:p-12 transition-all">

        {mode === 'edit' ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Commencez à écrire ou collez votre texte ici..."
            className="w-full h-full min-h-[60vh] resize-none outline-none text-lg leading-relaxed text-neutral-800 placeholder:text-neutral-300 bg-transparent font-serif"
            spellCheck={false}
          />
        ) : (
          <div className="prose-editor whitespace-pre-wrap font-serif">
            {segments.map((seg) => {
              if (seg.type === 'text') {
                return <span key={seg.id}>{seg.content}</span>;
              }
              const correction = seg.data as Correction;
              const isHovered = hoveredId === correction.id;

              return (
                <span
                  key={correction.id}
                  className={clsx(
                    "relative inline-block rounded-md cursor-pointer transition-all px-0.5 -mx-0.5 border-b-2 border-transparent",
                    typeColors[correction.type] || 'bg-gray-100',
                    isHovered && "ring-2 ring-offset-1 ring-neutral-900 border-transparent z-50"
                  )}
                  onMouseEnter={() => handleMouseEnter(correction.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {text.slice(correction.start, correction.end)}

                  {isHovered && (
                    <CorrectionTooltip
                      correction={correction}
                      onApply={() => applyCorrection(correction.id)}
                      onIgnore={() => ignoreCorrection(correction.id)}
                      onMouseEnter={() => handleMouseEnter(correction.id)}
                      onMouseLeave={handleMouseLeave}
                    />
                  )}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex justify-between text-xs font-medium text-neutral-400 px-4 uppercase tracking-wider">
        <div>
          {text.length} caractères &bull; {text.split(/\s+/).filter((w: string) => w).length} mots
        </div>
        <div>
          Coodlab, Mallevaey Lino &bull; Oratio
        </div>
      </div>

    </div>
  );
};
