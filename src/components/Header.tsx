import { Globe } from 'lucide-react';

import type { Dictionary } from '../constants/i18n';
import type { Lang } from '../types';

interface HeaderProps {
  lang: Lang;
  text: Dictionary;
  onToggleLang: () => void;
}

export function Header({ lang, text, onToggleLang }: HeaderProps) {
  return (
    <header className="mb-8 flex w-full max-w-7xl flex-col items-start justify-between border-b-4 border-brand-dark pb-4 md:mb-12 md:flex-row md:items-end">
      <div>
        <h1 className="font-syne text-4xl font-extrabold uppercase leading-none tracking-tighter sm:text-5xl md:text-7xl">
          AGNES<span className="text-brand-accent">_</span>AI
        </h1>
        <p className="mt-2 font-mono text-xs font-bold uppercase tracking-widest text-brand-muted sm:text-sm">
          {text.subtitle}
        </p>
      </div>
      <div className="mt-4 flex h-8 flex-wrap items-center gap-2 sm:h-9 sm:gap-4 md:mt-0">
        <button
          onClick={onToggleLang}
          className="flex h-full cursor-pointer items-center justify-center gap-1 border-2 border-brand-dark bg-brand-light px-3 font-mono text-[10px] font-bold text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light sm:text-xs"
        >
          <Globe size={14} />
          {lang === 'en' ? '中文' : 'EN'}
        </button>
        <div className="flex h-full items-center justify-center border-2 border-brand-dark bg-brand-dark px-3 font-mono text-[10px] uppercase text-brand-light sm:text-xs">
          {text.status}
        </div>
        <div className="flex h-full items-center justify-center border-2 border-brand-dark bg-brand-accent px-3 font-mono text-[10px] font-bold text-brand-dark sm:text-xs">
          V 2.1.0
        </div>
      </div>
    </header>
  );
}
