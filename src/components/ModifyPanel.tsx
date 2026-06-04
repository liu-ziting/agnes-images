import { ImagePlus, Link as LinkIcon, RefreshCw, Wand2, X } from 'lucide-react';

import type { Dictionary } from '../constants/i18n';
import { modifyPresets } from '../constants/options';
import type { Lang } from '../types';
import { SizeSelect } from './SizeSelect';

interface ModifyPanelProps {
  lang: Lang;
  text: Dictionary;
  baseImageUrl: string;
  baseImageName: string;
  modifyChange: string;
  modifyKeep: string;
  modifyNegativePrompt: string;
  imageSize: string;
  isGenerating: boolean;
  isUploadingBaseImage: boolean;
  onBaseImageUrlChange: (value: string) => void;
  onBaseImageUpload: (file: File) => void;
  onClearBaseImage: () => void;
  onModifyChange: (value: string) => void;
  onModifyKeep: (value: string) => void;
  onModifyNegativePrompt: (value: string) => void;
  onSizeChange: (value: string) => void;
  onApplyPreset: (preset: string) => void;
  onModify: () => void;
}

export function ModifyPanel({
  lang,
  text,
  baseImageUrl,
  baseImageName,
  modifyChange,
  modifyKeep,
  modifyNegativePrompt,
  imageSize,
  isGenerating,
  isUploadingBaseImage,
  onBaseImageUrlChange,
  onBaseImageUpload,
  onClearBaseImage,
  onModifyChange,
  onModifyKeep,
  onModifyNegativePrompt,
  onSizeChange,
  onApplyPreset,
  onModify
}: ModifyPanelProps) {
  return (
    <div
      className="contents"
      onPaste={(event) => {
        const file = Array.from(event.clipboardData.items)
          .find((item) => item.type.startsWith('image/'))
          ?.getAsFile();

        if (file) {
          event.preventDefault();
          onBaseImageUpload(file);
        }
      }}
    >
      <h2 className="border-b-2 border-brand-dark pb-2 font-syne text-xl font-bold uppercase sm:text-2xl">
        {text.mod_setup}
      </h2>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
          {text.base_url}
        </label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
          <input
            type="url"
            className="input-brutal w-full bg-transparent p-2 pl-9 font-mono text-xs sm:text-sm"
            placeholder={text.base_url_placeholder}
            value={baseImageUrl}
            onChange={(event) => onBaseImageUrlChange(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 border-2 border-brand-dark px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light sm:text-xs">
            <ImagePlus size={14} />
            {isUploadingBaseImage ? text.btn_mod_ing : text.upload_base}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onBaseImageUpload(file);
                }

                event.currentTarget.value = '';
              }}
            />
          </label>

          {baseImageUrl && (
            <button
              onClick={onClearBaseImage}
              className="flex items-center gap-2 border-2 border-brand-dark px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light sm:text-xs"
            >
              <X size={14} />
              {text.clear_base}
            </button>
          )}
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-brand-muted sm:text-xs">
          {text.upload_hint}
        </p>
      </div>

      {baseImageUrl && (
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
            {text.base_preview}
          </label>
          <div className="border-2 border-brand-dark bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
                {baseImageName || text.source_local}
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark sm:text-xs">
                {baseImageUrl.startsWith('data:') ? text.source_local : 'URL'}
              </span>
            </div>
            <div className="mt-3 flex max-h-64 items-center justify-center overflow-hidden border-2 border-brand-dark bg-brand-light p-2">
              <img src={baseImageUrl} alt="Base Preview" className="max-h-60 max-w-full object-contain" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
          {text.mod_presets}
        </label>
        <div className="flex flex-wrap gap-2">
          {modifyPresets.map((preset) => (
            <button
              key={preset.en}
              onClick={() => onApplyPreset(preset[lang])}
              className="border-2 border-brand-dark px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-accent hover:text-brand-light sm:text-xs"
            >
              {preset[lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-accent sm:text-xs">
            {text.mod_change}
          </label>
          <textarea
            className="input-brutal h-20 w-full resize-none bg-transparent p-3 font-mono text-xs sm:h-24 sm:text-sm"
            placeholder={text.mod_change_placeholder}
            value={modifyChange}
            onChange={(event) => onModifyChange(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
            {text.mod_keep}
          </label>
          <input
            type="text"
            className="input-brutal w-full bg-transparent p-2 font-mono text-xs sm:p-3 sm:text-sm"
            placeholder={text.mod_keep_placeholder}
            value={modifyKeep}
            onChange={(event) => onModifyKeep(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
            {text.mod_negative}
          </label>
          <textarea
            className="input-brutal h-20 w-full resize-none bg-transparent p-3 font-mono text-xs sm:text-sm"
            placeholder={text.mod_negative_placeholder}
            value={modifyNegativePrompt}
            onChange={(event) => onModifyNegativePrompt(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
            {text.mod_size}
          </label>
          <SizeSelect value={imageSize} onChange={onSizeChange} />
        </div>
      </div>

      <button
        onClick={onModify}
        disabled={!baseImageUrl || !modifyChange || isGenerating}
        className="group relative mt-2 w-full overflow-hidden border-2 border-brand-dark bg-brand-dark py-3 font-syne text-sm font-bold uppercase text-brand-light disabled:opacity-50 sm:py-4 sm:text-base"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
          {isGenerating ? text.btn_mod_ing : text.btn_mod}
        </span>
        <div className="absolute inset-0 z-0 -translate-x-full transform bg-brand-accent transition-transform duration-300 ease-out group-hover:translate-x-0" />
      </button>
    </div>
  );
}
