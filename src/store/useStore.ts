import { create } from 'zustand';
import type { Correction, CorrectionResponse } from '../lib/types';
import { fetchCorrections } from '../lib/api';

interface State {
  text: string;
  corrections: Correction[];
  isLoading: boolean;
  error: string | null;
  
  setText: (text: string) => void;
  analyzeText: (apiKey: string) => Promise<void>;
  applyCorrection: (id: string) => void;
  applyAllCorrections: () => void;
  ignoreCorrection: (id: string) => void;
  clearCorrections: () => void;
}

export const useStore = create<State>((set, get) => ({
  text: "",
  corrections: [],
  isLoading: false,
  error: null,

  setText: (text: string) => set({ text, corrections: [] }),
  
  clearCorrections: () => set({ corrections: [], error: null }),

  analyzeText: async (apiKey: string) => {
    const { text } = get();
    if (!text.trim()) return;

    set({ isLoading: true, error: null, corrections: [] });
    
    try {
      const data: CorrectionResponse = await fetchCorrections(text, apiKey);
      
      const processedCorrections: Correction[] = [];
      let searchIndex = 0;

      for (const apiCorr of data.corrections) {
        const foundIndex = text.indexOf(apiCorr.original, searchIndex);

        if (foundIndex !== -1) {
          processedCorrections.push({
            id: apiCorr.id || `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: apiCorr.type,
            original: apiCorr.original,
            suggestion: apiCorr.suggestion,
            message: apiCorr.message,
            start: foundIndex,
            end: foundIndex + apiCorr.original.length
          });
          
          searchIndex = foundIndex + 1;
        } else {
          console.warn(`Could not find original text for correction: "${apiCorr.original}"`);
          const fallbackIndex = text.indexOf(apiCorr.original);
          if (fallbackIndex !== -1) {
             processedCorrections.push({
              id: apiCorr.id || `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: apiCorr.type,
              original: apiCorr.original,
              suggestion: apiCorr.suggestion,
              message: apiCorr.message,
              start: fallbackIndex,
              end: fallbackIndex + apiCorr.original.length
            });
          }
        }
      }

      set({ corrections: processedCorrections, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  applyCorrection: (id: string) => {
    const { text, corrections } = get();
    const correctionToApply = corrections.find((c) => c.id === id);
    
    if (!correctionToApply) return;

    const { start, end, suggestion } = correctionToApply;
    
    const prefix = text.slice(0, start);
    const suffix = text.slice(end);
    const newText = prefix + suggestion + suffix;
    
    const lengthDiff = suggestion.length - (end - start);
    
    const updatedCorrections = corrections
      .filter((c) => c.id !== id)
      .map((c) => {
        if (c.start >= end) {
          return {
            ...c,
            start: c.start + lengthDiff,
            end: c.end + lengthDiff
          };
        }
        if (c.end <= start) {
          return c;
        }
        return null;
      })
      .filter((c): c is Correction => c !== null);

    set({
      text: newText,
      corrections: updatedCorrections
    });
  },

  applyAllCorrections: () => {
    const { corrections } = get();
    let { text } = get();
    
    // Sort corrections by start index descending to apply from end to start.
    // This prevents index shifting issues without complex recalculations.
    const sortedCorrections = [...corrections].sort((a, b) => b.start - a.start);
    
    for (const corr of sortedCorrections) {
       // Verify validity (optional but good)
       const currentSegment = text.slice(corr.start, corr.end);
       // Simple check if it roughly matches or assume indices are correct from current state
       if (currentSegment === corr.original) {
          const prefix = text.slice(0, corr.start);
          const suffix = text.slice(corr.end);
          text = prefix + corr.suggestion + suffix;
       }
    }
    
    set({ text, corrections: [] });
  },

  ignoreCorrection: (id: string) => {
    set((state) => ({
      corrections: state.corrections.filter((c) => c.id !== id)
    }));
  }
}));
