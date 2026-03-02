import type { ClientRectsFingerprint } from '@/types/fingerprint';
import { hashString } from '@/utils/hash';

export function detectClientRects(): ClientRectsFingerprint {
  // 创建一个测试元素来获取 ClientRects
  const testElement = document.createElement('div');
  testElement.style.position = 'absolute';
  testElement.style.left = '-9999px';
  testElement.style.top = '-9999px';
  testElement.style.width = '100px';
  testElement.style.height = '100px';
  testElement.textContent = 'Test';
  
  document.body.appendChild(testElement);

  try {
    const rects = testElement.getClientRects();
    const rectsData = Array.from(rects).map(rect => ({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
    }));

    // 生成哈希
    const rectsString = JSON.stringify(rectsData);
    const rectsHash = hashString(rectsString);

    document.body.removeChild(testElement);

    return {
      rects: rectsData,
      hash: rectsHash,
    };
  } catch (e) {
    document.body.removeChild(testElement);
    return {
      rects: [],
      hash: hashString(''),
    };
  }
}
