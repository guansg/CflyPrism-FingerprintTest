// 检测选项类型定义
// 分组与顺序对齐客户端 FingerprintConfigEditor 的 7 个 Tab

export interface DetectionOptions {
  // 基础指纹 (对应客户端 Tab: basic)
  navigator: boolean;
  uiLanguage: boolean;
  timezone: boolean;
  geolocation: boolean;
  permissions: boolean;
  screen: boolean;
  viewport: boolean;
  fonts: boolean;

  // 硬件信息 (对应客户端 Tab: hardware)
  clientRects: boolean;
  mediaDevices: boolean;

  // Canvas (对应客户端 Tab: canvas)
  canvas: boolean;

  // WebGL (对应客户端 Tab: webgl)
  webgl: boolean;
  webgpu: boolean;

  // Audio (对应客户端 Tab: audio)
  audio: boolean;
  speechVoices: boolean;

  // 网络层 (对应客户端 Tab: network)
  webrtc: boolean;

  // 反检测 (对应客户端 Tab: antiDetection)
  automation: boolean;
}

// 默认配置：推荐配置（不含需要权限的）
export const DEFAULT_DETECTION_OPTIONS: DetectionOptions = {
  navigator: true,
  uiLanguage: true,
  timezone: true,
  geolocation: false,
  permissions: false,
  screen: true,
  viewport: true,
  fonts: true,
  clientRects: true,
  mediaDevices: false,
  canvas: true,
  webgl: true,
  webgpu: true,
  audio: true,
  speechVoices: true,
  webrtc: true,
  automation: true,
};

// 快速检测配置（只检测基础指纹）
export const QUICK_DETECTION_OPTIONS: DetectionOptions = {
  navigator: true,
  uiLanguage: true,
  timezone: true,
  geolocation: false,
  permissions: false,
  screen: true,
  viewport: true,
  fonts: false,
  clientRects: false,
  mediaDevices: false,
  canvas: false,
  webgl: false,
  webgpu: false,
  audio: false,
  speechVoices: false,
  webrtc: false,
  automation: false,
};

// 全选配置
export const ALL_DETECTION_OPTIONS: DetectionOptions = {
  navigator: true,
  uiLanguage: true,
  timezone: true,
  geolocation: true,
  permissions: true,
  screen: true,
  viewport: true,
  fonts: true,
  clientRects: true,
  mediaDevices: true,
  canvas: true,
  webgl: true,
  webgpu: true,
  audio: true,
  speechVoices: true,
  webrtc: true,
  automation: true,
};

// 全不选配置
export const NONE_DETECTION_OPTIONS: DetectionOptions = {
  navigator: false,
  uiLanguage: false,
  timezone: false,
  geolocation: false,
  permissions: false,
  screen: false,
  viewport: false,
  fonts: false,
  clientRects: false,
  mediaDevices: false,
  canvas: false,
  webgl: false,
  webgpu: false,
  audio: false,
  speechVoices: false,
  webrtc: false,
  automation: false,
};

// 检测项分组（对齐客户端 FingerprintConfigEditor 的 7 个 Tab）
export const DETECTION_GROUPS = [
  {
    name: '基础指纹',
    items: [
      { key: 'navigator', label: 'Navigator', requiresPermission: false },
      { key: 'uiLanguage', label: 'UI Language', requiresPermission: false },
      { key: 'timezone', label: 'Timezone', requiresPermission: false },
      { key: 'geolocation', label: 'Geolocation', requiresPermission: true },
      { key: 'permissions', label: 'Permissions', requiresPermission: true },
      { key: 'screen', label: 'Screen', requiresPermission: false },
      { key: 'viewport', label: 'Viewport', requiresPermission: false },
      { key: 'fonts', label: 'Fonts', requiresPermission: false },
    ],
  },
  {
    name: '硬件信息',
    items: [
      { key: 'clientRects', label: 'ClientRects', requiresPermission: false },
      { key: 'mediaDevices', label: 'MediaDevices', requiresPermission: true },
    ],
  },
  {
    name: 'Canvas',
    items: [
      { key: 'canvas', label: 'Canvas', requiresPermission: false },
    ],
  },
  {
    name: 'WebGL',
    items: [
      { key: 'webgl', label: 'WebGL', requiresPermission: false },
      { key: 'webgpu', label: 'WebGPU', requiresPermission: false },
    ],
  },
  {
    name: 'Audio',
    items: [
      { key: 'audio', label: 'Audio', requiresPermission: false },
      { key: 'speechVoices', label: 'SpeechVoices', requiresPermission: false },
    ],
  },
  {
    name: '网络层',
    items: [
      { key: 'webrtc', label: 'WebRTC', requiresPermission: false },
    ],
  },
  {
    name: '反检测',
    items: [
      { key: 'automation', label: 'Automation', requiresPermission: false },
    ],
  },
] as const;
