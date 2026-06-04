import { useState } from 'react';
import { ChevronDown, ImagePlus, Link as LinkIcon, RefreshCw, Wand2, X } from 'lucide-react';

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
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      <div className="border-b-2 border-brand-dark pb-4">
        <h2 className="font-syne text-xl font-bold uppercase sm:text-2xl">{text.mod_setup}</h2>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-brand-muted sm:text-xs">
          {text.task_modify_desc}
        </p>
      </div>

      <div className="border-2 border-brand-dark bg-white p-4">
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
      </div>

      {baseImageUrl && (
        <div className="border-2 border-brand-dark bg-white p-4">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-muted sm:text-xs">
            {text.base_preview}
          </label>
          <div className="mt-3">
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

      <div className="border-2 border-brand-dark bg-white p-4">
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

        <div className="mt-4 flex flex-col gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-accent sm:text-xs">
            {text.mod_change}
          </label>
          <textarea
            className="input-brutal h-24 w-full resize-none bg-transparent p-3 font-mono text-xs sm:h-28 sm:text-sm"
            placeholder={text.mod_change_placeholder}
            value={modifyChange}
            onChange={(event) => onModifyChange(event.target.value)}
          />
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
          </div>
        )}
      </div>

      <button
        onClick={onModify}
        disabled={!baseImageUrl || !modifyChange || isGenerating}
        className="group relative mt-1 w-full overflow-hidden border-2 border-brand-dark bg-brand-dark py-4 font-syne text-sm font-bold uppercase text-brand-light disabled:opacity-50 sm:text-base"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
          {isGenerating ? text.btn_mod_ing : text.btn_mod}
        </span>
        <div className="absolute inset-0 z-0 -translate-x-full transform bg-brand-accent transition-transform duration-300 ease-out group-hover:translate-x-0" />
      </button>

      {!showAdvanced && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-brand-dark bg-white px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-brand-muted">{text.mod_keep}</p>
            <p className="mt-1 font-syne text-sm font-bold uppercase">
              {modifyKeep.trim() ? text.prompt_ready : text.context_none}
            </p>
          </div>
          <div className="border border-brand-dark bg-white px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-brand-muted">{text.mod_size}</p>
            <p className="mt-1 font-syne text-sm font-bold uppercase">{imageSize}</p>
          </div>
        </div>
      )}
    </div>
  );
}
