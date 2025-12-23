import { useState } from 'react';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { ApiKeyModal } from './components/ApiKeyModal';
import { useApiKey } from './hooks/useApiKey';

function App() {
  const { key, update } = useApiKey();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <div className="flex flex-col items-center min-h-screen">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <main className="w-full flex-1 flex flex-col">
          <div className="flex-1 w-full">
            <Editor 
              apiKey={key} 
              onRequireKey={() => setIsSettingsOpen(true)} 
            />
          </div>
        </main>
      </div>

      <ApiKeyModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        apiKey={key}
        onSave={update}
      />
    </div>
  );
}

export default App;