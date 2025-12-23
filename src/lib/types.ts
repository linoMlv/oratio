export type CorrectionType = 
  | 'spelling' 
  | 'grammar' 
  | 'syntax' 
  | 'repetition' 
  | 'coherence' 
  | 'punctuation' 
  | 'style';

export interface Correction {
  id: string;
  type: CorrectionType;
  original: string;
  suggestion: string;
  start: number;
  end: number;
  message: string;
}

// The API might not return start/end, or they might be wrong.
// We will calculate them in the frontend.
export interface ApiCorrection {
  id?: string;
  type: CorrectionType;
  original: string;
  suggestion: string;
  message: string;
  // start/end are now optional or ignored from API
  start?: number;
  end?: number; 
}

export interface CorrectionResponse {
  corrections: ApiCorrection[];
}