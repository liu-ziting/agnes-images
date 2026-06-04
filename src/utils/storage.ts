import type { HistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'agnes-images-history';

export function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is HistoryItem => {
      return (
        typeof item?.id === 'string' &&
        typeof item?.url === 'string' &&
        typeof item?.prompt === 'string' &&
        typeof item?.negativePrompt === 'string' &&
        typeof item?.type === 'string' &&
        typeof item?.timestamp === 'number' &&
        typeof item?.size === 'string'
      );
    });
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}
