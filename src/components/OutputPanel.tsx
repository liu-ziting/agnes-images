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
    <section className="border-brutal bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-1 border-b-2 border-brand-dark pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-syne text-xl font-bold uppercase sm:text-2xl">{text.output_title}</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-brand-muted sm:text-xs">
            {text.output_hint}
          </p>
        </div>
        <div className="border border-brand-dark bg-brand-light px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark sm:text-xs">
          {generatedImage ? text.result_ready : text.result_empty_title}
        </div>
      </div>

      <div className="mt-4 border-2 border-brand-dark bg-brand-dark p-3 sm:p-4">
        {isGenerating ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-brand-light md:min-h-[500px]">
            <RefreshCw className="animate-spin text-brand-accent" size={40} />
            <span className="animate-pulse px-4 text-center font-mono text-xs uppercase tracking-widest sm:text-sm">
              {text.out_wait}
            </span>
          </div>
        ) : generatedImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[360px] flex-col gap-4 md:min-h-[500px]"
          >
            <div className="flex flex-1 items-center justify-center overflow-hidden bg-[#111111] p-2 sm:p-4">
              <img
                src={generatedImage}
                alt="Generated"
                className="max-h-full max-w-full border-2 border-brand-dark bg-white object-contain"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <button
                onClick={onOpenDetails}
                className="flex items-center justify-center gap-2 border-2 border-brand-dark bg-brand-light px-4 py-3 font-syne text-sm font-bold uppercase text-brand-dark transition-colors hover:border-brand-accent"
              >
                <Maximize2 size={18} />
                {text.btn_details}
              </button>
              <button
                onClick={onDownload}
                className="flex items-center justify-center gap-2 border-2 border-brand-dark bg-brand-light px-4 py-3 font-syne text-sm font-bold uppercase text-brand-dark transition-colors hover:border-brand-accent"
              >
                <Download size={18} />
                {text.btn_down}
              </button>
              <button
                onClick={onModifyThis}
                className="flex items-center justify-center gap-2 border-2 border-brand-dark bg-brand-accent px-4 py-3 font-syne text-sm font-bold uppercase text-brand-light transition-colors hover:bg-brand-dark"
              >
                <RefreshCw size={18} />
                {text.btn_mod_this}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center border-2 border-dashed border-brand-muted/30 bg-[#111111] px-6 text-center md:min-h-[500px]">
            <p className="font-syne text-xl font-bold uppercase text-brand-light sm:text-2xl">
              {text.result_empty_title}
            </p>
            <p className="mt-3 max-w-md font-mono text-[11px] uppercase tracking-wider text-brand-muted sm:text-xs">
              {text.result_empty_hint}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
