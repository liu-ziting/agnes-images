export type Tab = 'generate' | 'modify';
export type Lang = 'en' | 'zh';
export type HistoryItemType = 'generate' | 'modify';

export interface PromptVariant {
  id: string;
  title: string;
  prompt: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  prompt: string;
  negativePrompt: string;
  type: HistoryItemType;
  timestamp: number;
  size: string;
  baseImageUrl?: string;
  keepInstructions?: string;
  changeInstructions?: string;
  sourceHistoryId?: string;
  sourceHistoryPrompt?: string;
  sourceLabel?: string;
  localBaseImageName?: string;
}
