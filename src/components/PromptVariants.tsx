import type { Dictionary } from '../constants/i18n';
import type { PromptVariant } from '../types';

interface PromptVariantsProps {
  text: Dictionary;
  variants: PromptVariant[];
  onUseVariant: (variant: PromptVariant) => void;
}

export function PromptVariants({ text, variants, onUseVariant }: PromptVariantsProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t-2 border-brand-dark pt-2">
      <div>
        <h3 className="font-syne text-lg font-bold uppercase">{text.prompt_variants}</h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-brand-muted sm:text-xs">
          {text.prompt_variants_hint}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {variants.map((variant) => (
          <div key={variant.id} className="border-2 border-brand-dark bg-white p-3">
            <div className="flex items-center justify-between gap-3 border-b border-brand-dark pb-2">
              <h4 className="font-syne text-sm font-bold uppercase sm:text-base">{variant.title}</h4>
              <button
                onClick={() => onUseVariant(variant)}
                className="border-2 border-brand-dark px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-dark hover:text-brand-light"
              >
                {text.use_variant}
              </button>
            </div>
            <p className="mt-3 font-mono text-xs leading-relaxed sm:text-sm">{variant.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
