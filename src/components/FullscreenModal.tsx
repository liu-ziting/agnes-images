import { AnimatePresence, motion } from 'framer-motion';
import { Download, Info, RefreshCw, X } from 'lucide-react';

import type { Dictionary } from '../constants/i18n';
import type { HistoryItem } from '../types';

interface FullscreenModalProps {
  item: HistoryItem | null;
  text: Dictionary;
  showDetails: boolean;
  onClose: () => void;
  onToggleDetails: () => void;
  onDownload: (url: string) => void;
  onModifyThis: (url: string) => void;
  onRestoreItem: (item: HistoryItem) => void;
}

export function FullscreenModal({
  item,
  text,
  showDetails,
  onClose,
  onToggleDetails,
  onDownload,
  onModifyThis,
  onRestoreItem
}: FullscreenModalProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-brand-dark/95"
          onClick={onClose}
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute right-4 top-4 z-[70] rounded-none border-2 border-brand-light bg-brand-dark/80 p-2 text-brand-light backdrop-blur-sm transition-colors hover:border-brand-accent hover:text-brand-accent md:right-8 md:top-8"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            <X size={24} className="md:h-8 md:w-8" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-0 flex h-full w-full cursor-default items-center justify-center p-4 pb-24 md:p-12"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={item.url}
              alt="Fullscreen"
              className="max-h-full max-w-full border-4 border-brand-light object-contain shadow-2xl"
            />
          </motion.div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-24 left-4 right-4 z-[60] flex max-h-[50vh] w-auto flex-col gap-4 overflow-y-auto border-brutal bg-brand-light p-5 shadow-2xl md:bottom-28 md:left-auto md:right-8 md:w-96 md:p-6"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-2 flex items-center justify-between border-b-2 border-brand-dark pb-2">
                  <h3 className="font-syne text-xl font-bold uppercase">{text.det_title}</h3>
                  <button onClick={onToggleDetails} className="text-brand-dark hover:text-brand-accent">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="bg-brand-dark px-2 py-1 font-mono text-[10px] font-bold uppercase text-brand-light">
                    {item.type === 'generate'
                      ? text.tab_generate.replace('01. ', '')
                      : text.tab_modify.replace('02. ', '')}
                  </span>
                  <span className="border border-brand-dark px-2 py-1 font-mono text-[10px] font-bold text-brand-dark">
                    {item.size}
                  </span>
                </div>

                <div className="border-2 border-brand-dark bg-white p-3">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                    {text.det_time}
                  </p>
                  <p className="mt-2 font-mono text-xs sm:text-sm">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                  {item.sourceLabel && (
                    <>
                      <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                        {text.det_parent}
                      </p>
                      <p className="mt-2 font-mono text-xs sm:text-sm">{item.sourceLabel}</p>
                    </>
                  )}
                </div>

                <div>
                  <label className="mt-2 font-mono text-xs font-bold uppercase tracking-wider text-brand-muted">
                    {text.det_prompt}
                  </label>
                  <div className="mt-2 overflow-y-auto border-2 border-brand-dark bg-white p-3">
                    <p className="font-mono text-xs leading-relaxed sm:text-sm">{item.prompt}</p>
                  </div>
                </div>

                {item.negativePrompt && (
                  <div>
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-brand-muted">
                      {text.det_negative}
                    </label>
                    <div className="mt-2 overflow-y-auto border-2 border-brand-dark bg-white p-3">
                      <p className="font-mono text-xs leading-relaxed sm:text-sm">{item.negativePrompt}</p>
                    </div>
                  </div>
                )}

                {item.changeInstructions && (
                  <div>
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-brand-muted">
                      {text.det_change}
                    </label>
                    <div className="mt-2 overflow-y-auto border-2 border-brand-dark bg-white p-3">
                      <p className="font-mono text-xs leading-relaxed sm:text-sm">{item.changeInstructions}</p>
                    </div>
                  </div>
                )}

                {item.keepInstructions && (
                  <div>
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-brand-muted">
                      {text.det_keep}
                    </label>
                    <div className="mt-2 overflow-y-auto border-2 border-brand-dark bg-white p-3">
                      <p className="font-mono text-xs leading-relaxed sm:text-sm">{item.keepInstructions}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {item.baseImageUrl && (
                    <div className="border-2 border-brand-dark bg-white p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                        {text.det_base}
                      </p>
                      <p className="mt-2 break-all font-mono text-xs sm:text-sm">{item.baseImageUrl}</p>
                    </div>
                  )}
                  {item.localBaseImageName && (
                    <div className="border-2 border-brand-dark bg-white p-3">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                        {text.det_source}
                      </p>
                      <p className="mt-2 font-mono text-xs sm:text-sm">{item.localBaseImageName}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-[70] flex justify-center md:bottom-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pointer-events-auto flex items-center border-2 border-brand-light bg-brand-dark/90 shadow-2xl backdrop-blur-md"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={onToggleDetails}
                className={`flex items-center gap-2 px-4 py-3 font-syne text-sm font-bold uppercase transition-colors md:text-base ${
                  showDetails ? 'bg-brand-accent text-brand-light' : 'text-brand-light hover:text-brand-accent'
                }`}
              >
                <Info size={18} />
                <span className="hidden sm:inline">{text.btn_details}</span>
              </button>
              <div className="h-6 w-[2px] bg-brand-light/30" />
              <button
                onClick={() => onRestoreItem(item)}
                className="flex items-center gap-2 px-4 py-3 font-syne text-sm font-bold uppercase text-brand-light transition-colors hover:text-brand-accent md:text-base"
              >
                <RefreshCw size={18} />
                <span className="hidden sm:inline">{text.restore_latest}</span>
              </button>
              <div className="h-6 w-[2px] bg-brand-light/30" />
              <button
                onClick={() => onDownload(item.url)}
                className="flex items-center gap-2 px-4 py-3 font-syne text-sm font-bold uppercase text-brand-light transition-colors hover:text-brand-accent md:text-base"
              >
                <Download size={18} />
                <span className="hidden sm:inline">{text.btn_down}</span>
              </button>
              <div className="h-6 w-[2px] bg-brand-light/30" />
              <button
                onClick={() => onModifyThis(item.url)}
                className="flex items-center gap-2 px-4 py-3 font-syne text-sm font-bold uppercase text-brand-accent transition-colors hover:text-brand-light md:text-base"
              >
                <RefreshCw size={18} />
                <span className="hidden sm:inline">{text.btn_mod_this}</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
