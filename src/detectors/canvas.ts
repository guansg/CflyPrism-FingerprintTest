import type { CanvasFingerprint } from '@/types/fingerprint';
import { hashString } from '@/utils/hash';

/**
 * Canvas 指纹检测
 * 基于 FingerprintJS 实现
 * 
 * @see https://www.browserleaks.com/canvas#how-does-it-work
 */
export async function detectCanvas(): Promise<CanvasFingerprint> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return {
      winding: false,
      geometry: '',
      text: '',
      dataURL: '',
      hash: '',
      isStable: false,
    };
  }

  // 检测 winding 规则支持
  const winding = doesSupportWinding(ctx);

  // 渲染文字图像
  renderTextImage(canvas, ctx);
  const textImage1 = canvas.toDataURL();
  const textImage2 = canvas.toDataURL();

  // 稳定性检测 - 某些浏览器会给 canvas 添加噪声
  const isStable = textImage1 === textImage2;

  let geometry = '';
  let text = '';

  if (isStable) {
    text = textImage1;
    // 渲染几何图像
    renderGeometryImage(canvas, ctx);
    geometry = canvas.toDataURL();
  } else {
    // 不稳定时标记
    text = 'unstable';
    geometry = 'unstable';
  }

  // 生成综合哈希
  const hash = hashString(`${winding}|${geometry}|${text}`);

  return {
    winding,
    geometry: isStable ? hashString(geometry) : 'unstable',
    text: isStable ? hashString(text) : 'unstable',
    dataURL: isStable ? geometry : '',
    hash,
    isStable,
  };
}

/**
 * 检测是否支持 winding 规则
 */
function doesSupportWinding(ctx: CanvasRenderingContext2D): boolean {
  ctx.rect(0, 0, 10, 10);
  ctx.rect(2, 2, 6, 6);
  return !ctx.isPointInPath(5, 5, 'evenodd');
}

/**
 * 渲染文字图像 - 用于检测文字渲染差异
 */
function renderTextImage(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  canvas.width = 240;
  canvas.height = 60;

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(100, 1, 62, 20);

  ctx.fillStyle = '#069';
  // 使用明确的内置字体，避免字体偏好的影响
  ctx.font = '11pt "Times New Roman"';
  // 使用包含 emoji 的文本来增加差异
  // 避免在 emoji 右边放文本，参考: https://github.com/fingerprintjs/fingerprintjs/issues/574
  const printedText = `Cwm fjordbank gly ${String.fromCharCode(55357, 56835)}`; // 😃
  ctx.fillText(printedText, 2, 15);

  ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
  ctx.font = '18pt Arial';
  ctx.fillText(printedText, 4, 45);
}

/**
 * 渲染几何图像 - 用于检测图形渲染差异
 */
function renderGeometryImage(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  canvas.width = 122;
  canvas.height = 110;

  // Canvas 混合模式
  ctx.globalCompositeOperation = 'multiply';

  // 绘制三个重叠的圆
  const circles: [string, number, number][] = [
    ['#f2f', 40, 40],
    ['#2ff', 80, 40],
    ['#ff2', 60, 80],
  ];

  for (const [color, x, y] of circles) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

  // Canvas winding 规则测试
  ctx.fillStyle = '#f9c';
  ctx.arc(60, 60, 60, 0, Math.PI * 2, true);
  ctx.arc(60, 60, 20, 0, Math.PI * 2, true);
  ctx.fill('evenodd');
}
