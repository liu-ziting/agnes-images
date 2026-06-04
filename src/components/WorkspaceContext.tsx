import { Clock3, FileText, Image as ImageIcon, Layers3, Sparkles } from 'lucide-react';

import type { Dictionary } from '../constants/i18n';

interface WorkspaceContextProps {
  text: Dictionary;
  modeLabel: string;
  sizeLabel: string;
  baseLabel: string;
  historyLabel: string;
  draftLabel: string;
  selectedLabel: string;
  statusMessage: string;
}

export function WorkspaceContext({
  text,
  modeLabel,
  sizeLabel,
  baseLabel,
  historyLabel,
  draftLabel,
  selectedLabel,
  statusMessage
}: WorkspaceContextProps) {
  const items = [
    { icon: Layers3, label: text.context_mode, value: modeLabel },
    { icon: Sparkles, label: text.context_size, value: sizeLabel },
    { icon: ImageIcon, label: text.context_base, value: baseLabel },
    { icon: FileText, label: text.context_draft, value: draftLabel },
    { icon: Clock3, label: text.context_history, value: historyLabel }
  ];

  return (
    <section className="border-brutal bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-syne text-xl font-bold uppercase sm:text-2xl">{text.workspace_context}</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-brand-muted sm:text-xs">
            {statusMessage}
          </p>
        </div>
        <div className="border border-brand-dark bg-brand-light px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark sm:text-xs">
          {text.context_selected}: {selectedLabel}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="border-2 border-brand-dark bg-brand-light p-3">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
              <Icon size={14} />
              {label}
            </div>
            <p className="mt-3 font-syne text-sm font-bold uppercase leading-snug text-brand-dark sm:text-base">
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
