import { ChevronRight, Image as ImageIcon, RefreshCw } from 'lucide-react';

import type { Dictionary } from '../constants/i18n';
import type { Tab } from '../types';

interface TabNavProps {
  activeTab: Tab;
  text: Dictionary;
  onTabChange: (tab: Tab) => void;
}

export function TabNav({ activeTab, text, onTabChange }: TabNavProps) {
  return (
    <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
      {(['generate', 'modify'] as Tab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex items-center justify-between border-2 px-3 py-2 text-left font-syne text-sm font-bold uppercase transition-all sm:text-lg md:px-4 md:py-3 md:text-2xl ${
            activeTab === tab
              ? 'translate-y-1 border-brand-accent bg-brand-accent text-brand-light lg:translate-x-2 lg:translate-y-0'
              : 'border-transparent hover:translate-y-[2px] hover:border-brand-dark lg:hover:translate-x-1 lg:hover:translate-y-0'
          }`}
        >
          {tab === 'generate' && (
            <span className="flex items-center gap-1 sm:gap-2">
              <ImageIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              {text.tab_generate}
            </span>
          )}
          {tab === 'modify' && (
            <span className="flex items-center gap-1 sm:gap-2">
              <RefreshCw className="h-4 w-4 sm:h-6 sm:w-6" />
              {text.tab_modify}
            </span>
          )}
          <ChevronRight className="hidden h-4 w-4 sm:block sm:h-6 sm:w-6" />
        </button>
      ))}
    </nav>
  );
}
