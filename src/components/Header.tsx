import { Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header = ({ onOpenSettings }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between py-6 px-8 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-serif font-bold text-neutral-800 tracking-tight">
        Oratio
      </h1>
      <button 
        onClick={onOpenSettings}
        className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-800"
        aria-label="API Settings"
      >
        <Settings size={20} />
      </button>
    </header>
  );
};
