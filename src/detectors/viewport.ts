import type { ViewportFingerprint } from '@/types/fingerprint';

export function detectViewport(): ViewportFingerprint {
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // 检测浏览器缩放级别
  // 方法1: 使用 visualViewport API（最准确）
  let zoomLevel: number | undefined;
  if ('visualViewport' in window && window.visualViewport) {
    const vp = window.visualViewport;
    // visualViewport.scale 直接提供缩放级别（某些浏览器支持）
    if ('scale' in vp && typeof (vp as any).scale === 'number') {
      zoomLevel = (vp as any).scale;
    } else if (vp.width > 0 && screen.width > 0) {
      // 通过 visualViewport.width 和 screen.width 计算
      // visualViewport.width 是 CSS 像素，screen.width 是设备像素
      const cssWidth = screen.width / devicePixelRatio;
      zoomLevel = cssWidth / vp.width;
    }
  }
  
  // 方法2: 使用 matchMedia 检测（某些浏览器）
  if (!zoomLevel && 'matchMedia' in window) {
    try {
      // 创建一个测试元素来检测缩放
      const testEl = document.createElement('div');
      testEl.style.width = '100px';
      testEl.style.height = '100px';
      testEl.style.position = 'absolute';
      testEl.style.left = '-9999px';
      document.body.appendChild(testEl);
      
      const rect = testEl.getBoundingClientRect();
      const computedWidth = rect.width;
      document.body.removeChild(testEl);
      
      // 如果实际宽度与设置的宽度不同，说明有缩放
      if (computedWidth > 0 && Math.abs(computedWidth - 100) > 1) {
        zoomLevel = computedWidth / 100;
      }
    } catch (e) {
      // 忽略错误
    }
  }
  
  // 方法3: 如果以上方法都不可用，使用 innerWidth 估算（最后手段）
  if (!zoomLevel && screen.width > 0 && window.innerWidth > 0) {
    // screen.width 是设备像素，需要转换为 CSS 像素
    const screenWidthCSS = screen.width / devicePixelRatio;
    // 考虑浏览器 UI 和滚动条，使用 outerWidth 更准确
    const windowWidth = window.outerWidth || window.innerWidth;
    if (windowWidth > 0) {
      const estimatedZoom = screenWidthCSS / windowWidth;
      // 限制在合理范围内（25% - 400%）
      if (estimatedZoom >= 0.25 && estimatedZoom <= 4) {
        zoomLevel = estimatedZoom;
      }
    }
  }
  
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    clientWidth: document.documentElement.clientWidth,
    clientHeight: document.documentElement.clientHeight,
    zoomLevel,
    devicePixelRatio,
  };
}
