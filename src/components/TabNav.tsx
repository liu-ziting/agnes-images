import { Image as ImageIcon, RefreshCw } from 'lucide-react';

import type { Dictionary } from '../constants/i18n';
import type { Tab } from '../types';

interface TabNavProps {
  activeTab: Tab;
  text: Dictionary;
  onTabChange: (tab: Tab) => void;
}

export function TabNav({ activeTab, text, onTabChange }: TabNavProps) {
  const items = [
    {
      tab: 'generate' as const,
      title: text.task_generate_title,
      description: text.task_generate_desc,
      icon: ImageIcon
    },
    {
      tab: 'modify' as const,
      title: text.task_modify_title,
      description: text.task_modify_desc,
      icon: RefreshCw
    }
  ];

  return (
    <nav className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      {items.map(({ tab, title, description, icon: Icon }) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`border-2 p-4 text-left transition-all ${
            activeTab === tab
              ? 'border-brand-accent bg-brand-accent text-brand-light shadow-[6px_6px_0px_rgba(255,51,0,0.15)]'
              : 'border-brand-dark bg-white text-brand-dark hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.08)]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center border-2 ${
                activeTab === tab ? 'border-brand-light text-brand-light' : 'border-brand-dark text-brand-dark'
              }`}
            >
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 sm:text-xs">
                {tab === 'generate' ? text.tab_generate : text.tab_modify}
              </p>
              <h3 className="mt-2 font-syne text-lg font-bold uppercase sm:text-xl">{title}</h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider opacity-80 sm:text-xs">
                {description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </nav>
  );
}
