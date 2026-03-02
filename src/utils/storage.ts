import type { FingerprintData } from '@/types/fingerprint';

const STORAGE_KEY = 'fingerprint-history';
const MAX_HISTORY = 100;

export interface HistoryItem extends FingerprintData {
  id: string;
}

export function saveToHistory(fingerprint: FingerprintData): void {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      ...fingerprint,
      id: Date.now().toString(),
    };
    
    history.unshift(newItem);
    
    // 只保留最近100条
    const trimmed = history.slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save to history:', e);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to get history:', e);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

export function removeFromHistory(id: string): void {
  try {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to remove from history:', e);
  }
}
