import { create } from 'zustand';
import type { FingerprintData, ConsistencyCheck } from '@/types/fingerprint';
import { detectAllFingerprints } from '@/detectors';
import { checkConsistency } from '@/utils/consistency';
import { saveToHistory, getHistory, clearHistory as clearHistoryStorage, removeFromHistory as removeFromHistoryStorage, type HistoryItem } from '@/utils/storage';
import type { DetectionOptions } from '@/types/detection';
import { ALL_DETECTION_OPTIONS } from '@/types/detection';

// 30秒限流常量
const RATE_LIMIT_MS = 30 * 1000;

// 存储定时器ID，用于清理
let cooldownTimerId: number | null = null;

interface FingerprintStore {
  fingerprint: FingerprintData | null;
  consistencyChecks: ConsistencyCheck[];
  history: HistoryItem[];
  isDetecting: boolean;
  error: string | null;
  detectionOptions: DetectionOptions;
  lastDetectTime: number | null;
  cooldownRemaining: number;
  
  detect: () => Promise<void>;
  clear: () => void;
  loadHistory: () => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  setDetectionOptions: (options: DetectionOptions) => void;
  canDetect: () => boolean;
  getCooldownRemaining: () => number;
  startCooldownTimer: () => void;
}

export const useFingerprintStore = create<FingerprintStore>((set, get) => ({
  fingerprint: null,
  consistencyChecks: [],
  history: [],
  isDetecting: false,
  error: null,
  detectionOptions: ALL_DETECTION_OPTIONS,
  lastDetectTime: null,
  cooldownRemaining: 0,

  canDetect: () => {
    const { lastDetectTime } = get();
    if (!lastDetectTime) return true;
    return Date.now() - lastDetectTime >= RATE_LIMIT_MS;
  },

  getCooldownRemaining: () => {
    const { lastDetectTime } = get();
    if (!lastDetectTime) return 0;
    const remaining = RATE_LIMIT_MS - (Date.now() - lastDetectTime);
    return Math.max(0, Math.ceil(remaining / 1000));
  },

  startCooldownTimer: () => {
    // 清理之前的定时器
    if (cooldownTimerId !== null) {
      clearTimeout(cooldownTimerId);
      cooldownTimerId = null;
    }
    
    const updateCooldown = () => {
      const remaining = get().getCooldownRemaining();
      set({ 
        cooldownRemaining: remaining
      });
      if (remaining > 0) {
        cooldownTimerId = setTimeout(updateCooldown, 1000);
      } else {
        // 倒计时结束，清除定时器ID
        cooldownTimerId = null;
      }
    };
    updateCooldown();
  },

  detect: async () => {
    const { canDetect, detectionOptions: options, startCooldownTimer, getCooldownRemaining } = get();
    
    // 检查限流
    if (!canDetect()) {
      const remaining = getCooldownRemaining();
      set({
        isDetecting: false,
        cooldownRemaining: remaining,
      });
      // 启动倒计时定时器以动态更新按钮显示
      startCooldownTimer();
      return;
    }
    
    // 检查是否至少选择了一个检测项
    const hasAnyOption = Object.values(options).some(v => v === true);
    if (!hasAnyOption) {
      set({
        error: '请至少选择一个检测项',
        isDetecting: false,
      });
      return;
    }
    
    set({ isDetecting: true, error: null });
    try {
      const fingerprint = await detectAllFingerprints(options);
      const consistencyChecks = checkConsistency(fingerprint);
      
      saveToHistory(fingerprint);
      
      const now = Date.now();
      set({
        fingerprint,
        consistencyChecks,
        isDetecting: false,
        lastDetectTime: now,
        cooldownRemaining: Math.ceil(RATE_LIMIT_MS / 1000),
      });
      
      // 启动倒计时更新
      startCooldownTimer();
      
      // 重新加载历史记录
      get().loadHistory();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '检测失败',
        isDetecting: false,
      });
    }
  },

  setDetectionOptions: (options: DetectionOptions) => {
    set({ detectionOptions: options });
  },

  clear: () => {
    set({
      fingerprint: null,
      consistencyChecks: [],
      error: null,
    });
  },

  loadHistory: () => {
    const history = getHistory();
    set({ history });
  },

  clearHistory: () => {
    clearHistoryStorage();
    set({ history: [] });
  },

  removeFromHistory: (id: string) => {
    removeFromHistoryStorage(id);
    get().loadHistory();
  },
}));
