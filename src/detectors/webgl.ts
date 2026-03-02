import type { WebGLFingerprint } from '@/types/fingerprint';
import { hashString } from '@/utils/hash';

// 有效的上下文参数集合
const validContextParameters = new Set([
  10752, 2849, 2884, 2885, 2886, 2928, 2929, 2930, 2931, 2932, 2960, 2961, 2962, 2963, 2964, 2965, 2966, 2967, 2968,
  2978, 3024, 3042, 3088, 3089, 3106, 3107, 32773, 32777, 32823, 32824, 32936, 32937, 32938, 32939, 32968, 32969,
  32970, 32971, 3317, 33170, 3333, 3379, 3386, 33901, 33902, 34016, 34024, 34076, 3408, 3410, 3411, 3412, 3413, 3414,
  3415, 34467, 34816, 34817, 34818, 34819, 34877, 34921, 34930, 35660, 35661, 35724, 35738, 35739, 36003, 36004, 36005,
  36347, 36348, 36349, 37440, 37441, 37443, 7936, 7937, 7938,
]);

// 着色器类型
const shaderTypes = ['FRAGMENT_SHADER', 'VERTEX_SHADER'] as const;
// 精度类型
const precisionTypes = ['LOW_FLOAT', 'MEDIUM_FLOAT', 'HIGH_FLOAT', 'LOW_INT', 'MEDIUM_INT', 'HIGH_INT'] as const;

/**
 * WebGL 指纹检测
 * 基于 FingerprintJS 实现，提取更全面的 WebGL 参数
 */
export async function detectWebGL(): Promise<WebGLFingerprint> {
  const canvas = document.createElement('canvas');
  let gl: WebGLRenderingContext | null = null;

  // 尝试获取 WebGL 上下文
  canvas.addEventListener('webglCreateContextError', () => {
    gl = null;
  });

  for (const type of ['webgl', 'experimental-webgl']) {
    try {
      gl = canvas.getContext(type) as WebGLRenderingContext;
      if (gl) break;
    } catch {
      // 继续尝试
    }
  }

  if (!gl) {
    return createEmptyResult();
  }

  // 检查 getParameter 是否可用
  if (typeof gl.getParameter !== 'function') {
    return createEmptyResult();
  }

  // 获取基础信息
  const debugExtension = gl.getExtension('WEBGL_debug_renderer_info');
  
  const vendor = gl.getParameter(gl.VENDOR)?.toString() || '';
  const renderer = gl.getParameter(gl.RENDERER)?.toString() || '';
  const version = gl.getParameter(gl.VERSION)?.toString() || '';
  const shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION)?.toString() || '';
  
  // 获取未屏蔽的供应商和渲染器信息
  const vendorUnmasked = debugExtension 
    ? gl.getParameter(debugExtension.UNMASKED_VENDOR_WEBGL)?.toString() || ''
    : '';
  const rendererUnmasked = debugExtension 
    ? gl.getParameter(debugExtension.UNMASKED_RENDERER_WEBGL)?.toString() || ''
    : '';

  // 获取扩展列表
  const extensions = gl.getSupportedExtensions() || [];

  // 获取上下文属性
  const contextAttributes = gl.getContextAttributes();
  const attributes: string[] = [];
  if (contextAttributes) {
    for (const key of Object.keys(contextAttributes) as (keyof WebGLContextAttributes)[]) {
      attributes.push(`${key}=${contextAttributes[key]}`);
    }
  }

  // 获取参数
  const parameters: Record<string, any> = {};
  const parameterStrings: string[] = [];

  // 获取所有常量
  const glPrototype = Object.getPrototypeOf(gl);
  const constants = Object.keys(glPrototype).filter(key => 
    typeof key === 'string' && /^[A-Z0-9_]+$/.test(key)
  );

  for (const constant of constants) {
    const code = (gl as any)[constant] as number;
    if (typeof code === 'number') {
      if (validContextParameters.has(code)) {
        try {
          const value = gl.getParameter(code);
          parameters[constant] = value;
          parameterStrings.push(`${constant}=${code}=${value}`);
        } catch {
          // 忽略不支持的参数
        }
      }
    }
  }

  // 获取着色器精度
  const shaderPrecisions: string[] = [];
  for (const shaderType of shaderTypes) {
    for (const precisionType of precisionTypes) {
      try {
        const precision = gl.getShaderPrecisionFormat(
          (gl as any)[shaderType],
          (gl as any)[precisionType]
        );
        if (precision) {
          shaderPrecisions.push(
            `${shaderType}.${precisionType}=${precision.rangeMin},${precision.rangeMax},${precision.precision}`
          );
        }
      } catch {
        // 忽略错误
      }
    }
  }

  // 渲染测试图形
  canvas.width = 256;
  canvas.height = 256;
  renderTestGraphics(gl);
  const dataURL = canvas.toDataURL();

  // 生成综合哈希
  const hashInput = [
    vendorUnmasked || vendor,
    rendererUnmasked || renderer,
    version,
    shadingLanguageVersion,
    extensions.join(','),
    attributes.join(','),
    shaderPrecisions.join(','),
    dataURL,
  ].join('|');

  const hash = hashString(hashInput);

  return {
    vendor: vendorUnmasked || vendor,
    renderer: rendererUnmasked || renderer,
    version,
    shadingLanguageVersion,
    extensions,
    parameters,
    contextAttributes: attributes,
    shaderPrecisions,
    dataURL,
    hash,
  };
}

/**
 * 渲染测试图形
 */
function renderTestGraphics(gl: WebGLRenderingContext): void {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) return;

  gl.shaderSource(vertexShader, `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `);
  gl.shaderSource(fragmentShader, `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0.0, 0.5, 1.0, 1.0);
    }
  `);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram();
  if (!program) return;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

/**
 * 创建空结果
 */
function createEmptyResult(): WebGLFingerprint {
  return {
    vendor: '',
    renderer: '',
    version: '',
    shadingLanguageVersion: '',
    extensions: [],
    parameters: {},
    contextAttributes: [],
    shaderPrecisions: [],
    dataURL: '',
    hash: '',
  };
}
