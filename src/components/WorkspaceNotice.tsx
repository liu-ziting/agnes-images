import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

import type { Dictionary } from '../constants/i18n';

type NoticeTone = 'error' | 'success' | 'info';

interface WorkspaceNoticeProps {
  text: Dictionary;
  tone: NoticeTone;
  message: string;
  onClose: () => void;
}

export function WorkspaceNotice({ text, tone, message, onClose }: WorkspaceNoticeProps) {
  const iconMap = {
    error: AlertCircle,
    success: CheckCircle2,
    info: Info
  };

  const toneClassMap = {
    error: 'border-brand-accent bg-[#fff0ec] text-brand-dark',
    success: 'border-brand-dark bg-[#eef9ef] text-brand-dark',
    info: 'border-brand-dark bg-white text-brand-dark'
  };

  const Icon = iconMap[tone];

  return (
    <div className={`mb-6 flex items-start justify-between gap-3 border-2 p-3 ${toneClassMap[tone]}`}>
      <div className="flex items-start gap-3">
        <Icon size={18} className="mt-0.5 flex-shrink-0" />
        <p className="font-mono text-[11px] uppercase tracking-wider sm:text-xs">{message}</p>
      </div>
      <button
        type="button"
        aria-label={text.notice_close}
        onClick={onClose}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center border border-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light"
      >
        <X size={14} />
      </button>
    </div>
  );
}
