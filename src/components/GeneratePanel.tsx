import { useState } from 'react';
import { ChevronDown, RefreshCw, Sparkles, Wand2, Zap } from 'lucide-react';

import type { Dictionary } from '../constants/i18n';
import type { PromptVariant } from '../types';
import { PromptVariants } from './PromptVariants';
import { SizeSelect } from './SizeSelect';

interface GeneratePanelProps {
  text: Dictionary;
  prompt: string;
  negativePrompt: string;
  imageSize: string;
  isOptimizing: boolean;
  isGeneratingVariants: boolean;
  isGenerating: boolean;
  promptVariants: PromptVariant[];
  onPromptChange: (value: string) => void;
  onNegativePromptChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onOptimize: () => void;
  onGenerateVariants: () => void;
  onUseVariant: (variant: PromptVariant) => void;
  onGenerate: () => void;
}

export function GeneratePanel({
  text,
  prompt,
  negativePrompt,
  imageSize,
  isOptimizing,
  isGeneratingVariants,
  isGenerating,
  promptVariants,
  onPromptChange,
  onNegativePromptChange,
  onSizeChange,
  onOptimize,
  onGenerateVariants,
  onUseVariant,
  onGenerate
}: GeneratePanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      <div className="border-b-2 border-brand-dark pb-4">
        <h2 className="font-syne text-xl font-bold uppercase sm:text-2xl">{text.gen_setup}</h2>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-brand-muted sm:text-xs">
          {text.task_generate_desc}
        </p>
      </div>

      <div className="border-2 border-brand-dark bg-white p-4">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
            {text.img_prompt}
          </label>
          <textarea
            className="input-brutal h-36 w-full resize-none bg-transparent p-3 font-mono text-xs sm:h-44 sm:text-sm"
            placeholder={text.img_prompt_placeholder}
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button
            onClick={onOptimize}
            disabled={!prompt || isOptimizing || isGenerating || isGeneratingVariants}
            className="flex w-full items-center justify-center gap-2 border-2 border-brand-dark bg-transparent px-4 py-3 font-syne text-sm font-bold uppercase text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light disabled:opacity-50"
          >
            {isOptimizing ? <RefreshCw className="animate-spin" size={16} /> : <Wand2 size={16} />}
            {isOptimizing ? text.btn_opt_ing : text.btn_opt}
          </button>

          <button
            onClick={onGenerateVariants}
            disabled={!prompt || isGeneratingVariants || isGenerating || isOptimizing}
            className="flex w-full items-center justify-center gap-2 border-2 border-brand-dark bg-brand-light px-4 py-3 font-syne text-sm font-bold uppercase text-brand-dark transition-colors hover:bg-brand-accent hover:text-brand-light disabled:opacity-50"
          >
            {isGeneratingVariants ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            {isGeneratingVariants ? text.btn_variants_ing : text.btn_variants}
          </button>
        </div>
      </div>

      <div className="border-2 border-brand-dark bg-white">
        <button
          type="button"
          onClick={() => setShowAdvanced((current) => !current)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="font-syne text-base font-bold uppercase sm:text-lg">{text.advanced_settings}</span>
          <ChevronDown
            size={18}
            className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          />
        </button>

        {showAdvanced && (
          <div className="border-t-2 border-brand-dark p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
                  {text.negative_prompt}
                </label>
                <textarea
                  className="input-brutal h-20 w-full resize-none bg-transparent p-3 font-mono text-xs sm:text-sm"
                  placeholder={text.negative_prompt_placeholder}
                  value={negativePrompt}
                  onChange={(event) => onNegativePromptChange(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
                  {text.out_size}
                </label>
                <SizeSelect value={imageSize} onChange={onSizeChange} />
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onGenerate}
        disabled={!prompt || isGenerating || isOptimizing || isGeneratingVariants}
        className="group relative mt-1 w-full overflow-hidden border-2 border-brand-dark bg-brand-dark py-4 font-syne text-sm font-bold uppercase text-brand-light disabled:opacity-50 sm:text-base"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
          {isGenerating ? text.btn_gen_ing : text.btn_gen}
        </span>
        <div className="absolute inset-0 z-0 -translate-x-full transform bg-brand-accent transition-transform duration-300 ease-out group-hover:translate-x-0" />
      </button>

      {showAdvanced ? null : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-brand-dark bg-white px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-brand-muted">{text.out_size}</p>
            <p className="mt-1 font-syne text-sm font-bold uppercase">{imageSize}</p>
          </div>
          <div className="border border-brand-dark bg-white px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-brand-muted">{text.negative_prompt}</p>
            <p className="mt-1 font-syne text-sm font-bold uppercase">
              {negativePrompt.trim() ? text.prompt_ready : text.context_none}
            </p>
          </div>
        </div>
      )}
      <PromptVariants text={text} variants={promptVariants} onUseVariant={onUseVariant} />
    </>
  );
}
