import { Download, Maximize2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

import type { Dictionary } from '../constants/i18n';

interface OutputPanelProps {
  text: Dictionary;
  isGenerating: boolean;
  generatedImage: string | null;
  onOpenDetails: () => void;
  onDownload: () => void;
  onModifyThis: () => void;
}

export function OutputPanel({
  text,
  isGenerating,
  generatedImage,
  onOpenDetails,
  onDownload,
  onModifyThis
}: OutputPanelProps) {
  return (
    <div className="relative flex min-h-[400px] flex-1 items-center justify-center border-brutal bg-brand-dark p-2 md:min-h-[500px]">
      <div className="absolute left-4 top-0 z-10 -translate-y-1/2 bg-brand-accent px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-brand-light sm:text-xs">
        {text.out_canvas}
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center gap-4 text-brand-light">
          <RefreshCw className="animate-spin text-brand-accent" size={40} />
          <span className="animate-pulse px-4 text-center font-mono text-xs uppercase tracking-widest sm:text-sm">
            {text.out_wait}
          </span>
        </div>
      ) : generatedImage ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 flex h-full w-full flex-col items-center justify-center gap-4 p-2 sm:p-4 md:p-8"
        >
          <div className="flex w-full flex-1 items-center justify-center overflow-hidden">
            <img
              src={generatedImage}
              alt="Generated"
              className="max-h-full max-w-full border-2 border-brand-dark object-contain"
            />
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:flex-row sm:gap-4">
            <button
              onClick={onOpenDetails}
              className="flex w-full items-center justify-center gap-2 border-2 border-brand-dark bg-brand-light px-4 py-3 font-syne text-sm font-bold uppercase text-brand-dark transition-colors hover:border-brand-accent sm:w-auto sm:text-base md:px-6"
            >
              <Maximize2 size={18} />
              {text.btn_details}
            </button>
            <button
              onClick={onDownload}
              className="flex w-full items-center justify-center gap-2 border-2 border-brand-dark bg-brand-light px-4 py-3 font-syne text-sm font-bold uppercase text-brand-dark transition-colors hover:border-brand-accent sm:w-auto sm:text-base md:px-6"
            >
              <Download size={18} />
              {text.btn_down}
            </button>
            <button
              onClick={onModifyThis}
              className="flex w-full items-center justify-center gap-2 border-2 border-brand-dark bg-brand-accent px-4 py-3 font-syne text-sm font-bold uppercase text-brand-light transition-colors hover:bg-brand-dark sm:w-auto sm:text-base md:px-6"
            >
              <RefreshCw size={18} />
              {text.btn_mod_this}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="m-2 flex h-full w-full items-center justify-center border-2 border-dashed border-brand-muted/30 sm:m-4">
          <span className="px-4 text-center font-mono text-xs uppercase tracking-widest text-brand-muted sm:text-sm">
            {text.out_empty}
          </span>
        </div>
      )}
    </div>
  );
}
