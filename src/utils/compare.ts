import type { FingerprintData } from '@/types/fingerprint';

export type DiffStatus = 'same' | 'changed' | 'added' | 'removed';

export interface DiffItem {
  key: string;
  previous: string;
  current: string;
  status: DiffStatus;
}

export interface DiffGroup {
  name: string;
  items: DiffItem[];
  hasChanges: boolean;
  stats: { same: number; changed: number; added: number; removed: number };
}

export interface ComparisonResult {
  groups: DiffGroup[];
  summary: { total: number; same: number; changed: number; added: number; removed: number };
}

function stringify(val: unknown): string {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    if (typeof val[0] === 'string' || typeof val[0] === 'number') return val.join(', ');
    return JSON.stringify(val, null, 1);
  }
  return JSON.stringify(val, null, 1);
}

function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined || val === null) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      const nested = flattenObject(val, path);
      if (Object.keys(nested).length > 0) {
        Object.assign(result, nested);
      }
    } else {
      result[path] = val;
    }
  }
  return result;
}

function diffSection(
  prev: Record<string, any> | undefined | null,
  curr: Record<string, any> | undefined | null,
  skipKeys: string[] = []
): DiffItem[] {
  const items: DiffItem[] = [];
  const prevFlat = prev ? flattenObject(prev) : {};
  const currFlat = curr ? flattenObject(curr) : {};
  const allKeys = new Set([...Object.keys(prevFlat), ...Object.keys(currFlat)]);

  for (const key of allKeys) {
    if (skipKeys.includes(key)) continue;
    const pv = stringify(prevFlat[key]);
    const cv = stringify(currFlat[key]);
    const inPrev = key in prevFlat;
    const inCurr = key in currFlat;

    let status: DiffStatus;
    if (inPrev && inCurr) {
      status = pv === cv ? 'same' : 'changed';
    } else if (inCurr) {
      status = 'added';
    } else {
      status = 'removed';
    }

    items.push({ key, previous: inPrev ? pv : 'N/A', current: inCurr ? cv : 'N/A', status });
  }
  return items;
}

function makeGroup(name: string, items: DiffItem[]): DiffGroup {
  const stats = { same: 0, changed: 0, added: 0, removed: 0 };
  for (const it of items) stats[it.status]++;
  return { name, items, hasChanges: stats.changed + stats.added + stats.removed > 0, stats };
}

const SKIP_DATAURL = ['dataURL'];

export function compareFingerprints(
  previous: FingerprintData,
  current: FingerprintData
): ComparisonResult {
  const groups: DiffGroup[] = [];

  // 基础指纹
  groups.push(makeGroup('navigator', diffSection(previous.navigator, current.navigator)));
  groups.push(makeGroup('uiLanguage', diffSection(previous.uiLanguage as any, current.uiLanguage as any)));
  groups.push(makeGroup('timezone', diffSection(previous.timezone as any, current.timezone as any)));
  groups.push(makeGroup('geolocation', diffSection(previous.geolocation as any, current.geolocation as any)));
  groups.push(makeGroup('permissions', diffSection(previous.permissions as any, current.permissions as any)));
  groups.push(makeGroup('screen', diffSection(previous.screen as any, current.screen as any)));
  groups.push(makeGroup('viewport', diffSection(previous.viewport as any, current.viewport as any)));
  groups.push(makeGroup('fonts', diffSection(previous.fonts as any, current.fonts as any)));

  // 硬件信息
  groups.push(makeGroup('clientRects', diffSection(previous.clientRects as any, current.clientRects as any, ['rects'])));
  groups.push(makeGroup('mediaDevices', diffSection(previous.mediaDevices as any, current.mediaDevices as any, ['devices'])));

  // Canvas
  groups.push(makeGroup('canvas', diffSection(previous.canvas as any, current.canvas as any, SKIP_DATAURL)));

  // WebGL
  groups.push(makeGroup('webgl', diffSection(previous.webgl as any, current.webgl as any, SKIP_DATAURL)));
  groups.push(makeGroup('webgpu', diffSection(previous.webgpu as any, current.webgpu as any)));

  // Audio
  groups.push(makeGroup('audio', diffSection(previous.audio as any, current.audio as any)));
  groups.push(makeGroup('speechVoices', diffSection(
    previous.speechVoices ? { count: previous.speechVoices.count } : undefined,
    current.speechVoices ? { count: current.speechVoices.count } : undefined
  )));

  // 网络层
  groups.push(makeGroup('webrtc', diffSection(previous.webrtc as any, current.webrtc as any)));

  // 反检测
  groups.push(makeGroup('automation', diffSection(previous.automation as any, current.automation as any)));

  // 过滤掉两边都不存在的空组
  const filtered = groups.filter(g => g.items.length > 0);

  const summary = { total: 0, same: 0, changed: 0, added: 0, removed: 0 };
  for (const g of filtered) {
    summary.total += g.items.length;
    summary.same += g.stats.same;
    summary.changed += g.stats.changed;
    summary.added += g.stats.added;
    summary.removed += g.stats.removed;
  }

  return { groups: filtered, summary };
}
