import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
}

export const ApiKeyModal = ({ isOpen, onClose, apiKey, onSave }: ApiKeyModalProps) => {
  const [input, setInput] = useState(apiKey);

  useEffect(() => {
    setInput(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4 text-neutral-800">Configuration API</h2>
        
        <p className="text-neutral-600 mb-4 text-sm">
          Entrez votre clé API <strong>Google Gemini</strong> pour activer les corrections.
          <br />
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Obtenir une clé ici
          </a>
          <br />
          <span className="text-xs text-neutral-400">La clé est stockée uniquement dans votre navigateur.</span>
        </p>

        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="AIza..."
          className="w-full border border-neutral-200 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all font-mono text-sm"
        />

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors font-medium text-sm"
          >
            Annuler
          </button>
          <button 
            onClick={() => {
              onSave(input);
              onClose();
            }}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium text-sm shadow-sm"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};