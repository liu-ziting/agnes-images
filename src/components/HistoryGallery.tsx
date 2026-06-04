import { Clock, Eye, RefreshCw, Trash2, X } from 'lucide-react';

import type { Dictionary } from '../constants/i18n';
import type { HistoryItem } from '../types';

interface HistoryGalleryProps {
  text: Dictionary;
  historyImages: HistoryItem[];
  baseImageUrl: string;
  selectedItemId: string | null;
  onSelectItem: (item: HistoryItem) => void;
  onOpenItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onRestoreItem: (item: HistoryItem) => void;
  onUseAsBase: (url: string) => void;
}

export function HistoryGallery({
  text,
  historyImages,
  baseImageUrl,
  selectedItemId,
  onSelectItem,
  onOpenItem,
  onDeleteItem,
  onClearHistory,
  onRestoreItem,
  onUseAsBase
}: HistoryGalleryProps) {
  if (historyImages.length === 0) {
    return null;
  }

  const selectedItem =
    historyImages.find((item) => item.id === selectedItemId) ?? historyImages[0];

  const previewText = selectedItem.changeInstructions || selectedItem.prompt;
  const historyCountLabel = `${historyImages.length} ${text.history_count_suffix}`;

  return (
    <section className="mt-4 border-brutal bg-brand-light p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-brand-dark pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-brand-dark" />
            <h3 className="font-syne text-lg font-bold uppercase tracking-wider text-brand-dark">
              {text.history}
            </h3>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-brand-muted sm:text-xs">
            {text.history_hint}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-brand-muted sm:text-xs">
            {text.history_restore_hint}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="border border-brand-dark bg-white px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark sm:text-xs">
            {historyCountLabel}
          </div>
          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 border-2 border-brand-dark px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light sm:text-xs"
          >
            <Trash2 size={14} />
            {text.clear_history}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
          {text.history_timeline}
        </span>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {historyImages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`group relative h-24 w-24 flex-shrink-0 overflow-hidden border-2 bg-white text-left transition-all hover:-translate-y-0.5 sm:h-28 sm:w-28 ${
              selectedItem.id === item.id || baseImageUrl === item.url
                ? 'border-brand-accent shadow-[4px_4px_0px_rgba(255,51,0,0.12)]'
                : 'border-brand-dark'
            }`}
            onClick={() => onSelectItem(item)}
          >
            <img src={item.url} alt={`History ${index + 1}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-brand-dark/15 transition-colors group-hover:bg-brand-dark/0" />

            <button
              onClick={(event) => {
                event.stopPropagation();
                onDeleteItem(item.id);
              }}
              className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center border border-brand-light bg-brand-dark/80 text-brand-light opacity-0 transition-opacity hover:text-brand-accent group-hover:opacity-100"
              aria-label={text.delete_item}
            >
              <X size={12} />
            </button>

            {baseImageUrl === item.url && (
              <div className="absolute bottom-0 right-0 z-10 bg-brand-accent px-1.5 py-0.5 font-mono text-[8px] font-bold text-brand-light sm:text-[10px]">
                {text.active}
              </div>
            )}
            <div className="absolute left-0 top-0 z-10 bg-brand-dark px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase text-brand-light sm:text-[10px]">
              {item.type}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 border-2 border-brand-dark bg-white p-4">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="font-syne text-base font-bold uppercase sm:text-lg">
              {text.history_selected}
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="bg-brand-dark px-2 py-1 font-mono text-[10px] font-bold uppercase text-brand-light">
                {selectedItem.type}
              </span>
              <span className="border border-brand-dark px-2 py-1 font-mono text-[10px] font-bold text-brand-dark">
                {selectedItem.size}
              </span>
              <span className="border border-brand-dark px-2 py-1 font-mono text-[10px] font-bold text-brand-dark">
                {new Date(selectedItem.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
          {selectedItem.sourceLabel && (
            <p className="max-w-full font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
              {text.history_parent}: {selectedItem.sourceLabel}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="line-clamp-4 font-mono text-xs leading-relaxed text-brand-dark sm:text-sm">
            {previewText}
          </p>
          {selectedItem.keepInstructions && (
            <p className="font-mono text-[10px] uppercase tracking-wider text-brand-muted sm:text-xs">
              {text.det_keep}: {selectedItem.keepInstructions}
            </p>
          )}
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <button
              onClick={() => onOpenItem(selectedItem)}
              className="flex items-center gap-2 border-2 border-brand-dark px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light sm:text-xs"
            >
              <Eye size={14} />
              {text.btn_details}
            </button>
            <button
              onClick={() => onRestoreItem(selectedItem)}
              className="flex items-center gap-2 border-2 border-brand-dark px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light sm:text-xs"
            >
              <RefreshCw size={14} />
              {text.restore_params}
            </button>
            <button
              onClick={() => onUseAsBase(selectedItem.url)}
              className="flex items-center gap-2 border-2 border-brand-dark bg-brand-accent px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-light transition-colors hover:bg-brand-dark sm:text-xs"
            >
              <RefreshCw size={14} />
              {text.continue_from_this}
            </button>
            <button
              onClick={() => onDeleteItem(selectedItem.id)}
              className="flex items-center gap-2 border-2 border-brand-dark px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light sm:text-xs"
            >
              <Trash2 size={14} />
              {text.delete_item}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
