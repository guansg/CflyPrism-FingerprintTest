import type { AudioFingerprint } from '@/types/fingerprint';

// 特殊指纹状态
export const enum AudioSpecialFingerprint {
  /** 浏览器不支持音频上下文 */
  NotSupported = -2,
  /** 超时 */
  Timeout = -3,
  /** 浏览器已知会应用反指纹措施 */
  KnownForAntifingerprinting = -4,
}

/**
 * 基于 FingerprintJS 的音频指纹检测
 * https://fingerprint.com/blog/audio-fingerprinting/
 * 
 * 使用 OfflineAudioContext + DynamicsCompressor 生成音频指纹
 */
export async function detectAudio(): Promise<AudioFingerprint> {
  try {
    // 检查是否支持 OfflineAudioContext
    const AudioContext = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    if (!AudioContext) {
      return {
        contextId: 'not_supported',
        hash: AudioSpecialFingerprint.NotSupported.toString(),
      };
    }

    // 创建离线音频上下文
    // 参数: 声道数=1, 总样本数=5000, 采样率=44100
    const hashFromIndex = 4500;
    const hashToIndex = 5000;
    const context = new AudioContext(1, hashToIndex, 44100);

    // 创建振荡器 - 使用三角波, 频率 10000Hz
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 10000;

    // 创建动态压缩器 - 关键的指纹差异来源
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    // 连接节点: 振荡器 -> 压缩器 -> 输出
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);

    // 渲染音频并获取指纹
    const fingerprint = await renderAudio(context, hashFromIndex);

    return {
      contextId: 'offline',
      hash: fingerprint.toString(),
      // 额外信息
      sampleRate: context.sampleRate,
      fingerprint: fingerprint,
    };
  } catch (e) {
    console.warn('Audio fingerprint detection failed:', e);
    return {
      contextId: 'error',
      hash: '',
    };
  }
}

/**
 * 渲染音频并计算哈希
 */
async function renderAudio(context: OfflineAudioContext, hashFromIndex: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Audio rendering timeout'));
    }, 5000);

    context.oncomplete = (event) => {
      clearTimeout(timeout);
      // 获取音频数据，只取后500个样本 (4500-5000)
      const samples = event.renderedBuffer.getChannelData(0).subarray(hashFromIndex);
      const hash = calculateHash(samples);
      resolve(hash);
    };

    context.startRendering();
  });
}

/**
 * 计算音频哈希 - 对样本绝对值求和
 * 这是 FingerprintJS 使用的标准算法
 */
function calculateHash(samples: Float32Array): number {
  let hash = 0;
  for (let i = 0; i < samples.length; i++) {
    hash += Math.abs(samples[i]);
  }
  return hash;
}
