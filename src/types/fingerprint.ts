export interface NavigatorFingerprint {
  userAgent: string;
  platform: string;
  language: string;
  languages: string[];
  vendor: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
  maxTouchPoints: number;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  userAgentData?: {
    brands: Array<{ brand: string; version: string }>;
    mobile: boolean;
    platform: string;
    highEntropyValues?: {
      architecture?: string;
      bitness?: string;
      formFactors?: string[];
      model?: string;
      platformVersion?: string;
      fullVersionList?: Array<{ brand: string; version: string }>;
      isWow64?: boolean;
    };
  };
}

export interface ScreenFingerprint {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelDepth: number;
  devicePixelRatio: number;
}

export interface ViewportFingerprint {
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
  clientWidth: number;
  clientHeight: number;
  zoomLevel?: number;
  devicePixelRatio?: number;
}

export interface CanvasFingerprint {
  winding?: boolean;
  geometry?: string;
  text?: string;
  dataURL: string;
  hash: string;
  isStable?: boolean;
}

export interface WebGLFingerprint {
  vendor: string;
  renderer: string;
  version: string;
  shadingLanguageVersion: string;
  extensions: string[];
  parameters: Record<string, any>;
  contextAttributes?: string[];
  shaderPrecisions?: string[];
  dataURL: string;
  hash: string;
}

export interface AudioFingerprint {
  contextId: string;
  hash: string;
  sampleRate?: number;
  fingerprint?: number;
}

export interface FontsFingerprint {
  fonts: string[];
  count: number;
}

export interface MediaDevicesFingerprint {
  devices: MediaDeviceInfo[];
  count: number;
  permissionGranted: boolean | null;
  error?: string;
}

export interface WebRTCFingerprint {
  localIPs: string[];
  publicIPs: string[];
  privateIPs: string[];
  linkLocalIPs: string[];
  publicIP?: string;
  leakDetected: boolean;
  ipTypes: {
    [ip: string]: 'public' | 'private' | 'link-local' | 'loopback';
  };
}

export interface TimezoneFingerprint {
  timezone: string;
  offset: number;
}

export interface GeolocationFingerprint {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error?: string;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export interface PermissionsFingerprint {
  geolocation: 'granted' | 'denied' | 'prompt' | 'unknown';
  notifications: 'granted' | 'denied' | 'prompt' | 'unknown';
  camera: 'granted' | 'denied' | 'prompt' | 'unknown';
  microphone: 'granted' | 'denied' | 'prompt' | 'unknown';
  clipboardRead: 'granted' | 'denied' | 'prompt' | 'unknown';
  clipboardWrite: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export interface ClientRectsFingerprint {
  rects: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;
  hash: string;
}

export interface WebGPUFingerprint {
  available: boolean;
  adapter?: {
    features: string[];
    limits: Record<string, number>;
    info?: {
      vendor?: string;
      architecture?: string;
      device?: string;
      description?: string;
    };
  };
  error?: string;
}

export interface SpeechVoicesFingerprint {
  voices: Array<{
    name: string;
    lang: string;
    voiceURI: string;
    localService: boolean;
    default: boolean;
  }>;
  count: number;
}

export interface AutomationFingerprint {
  webdriver: boolean | undefined;
  chromeRuntime: boolean | undefined;
  automationFlags: {
    hasAutomationFlag: boolean;
    hasChromeAutomation: boolean;
  };
  otherFlags: Record<string, any>;
}

export interface UILanguageFingerprint {
  locale: string;
  dateTimeLocale: string;
  numberLocale: string;
  collatorLocale: string;
  relativeTimeLocale: string;
}

export interface FingerprintData {
  navigator: NavigatorFingerprint;
  screen: ScreenFingerprint;
  viewport: ViewportFingerprint;
  canvas: CanvasFingerprint;
  webgl: WebGLFingerprint;
  audio: AudioFingerprint;
  fonts: FontsFingerprint;
  mediaDevices: MediaDevicesFingerprint;
  webrtc: WebRTCFingerprint;
  timezone: TimezoneFingerprint;
  geolocation?: GeolocationFingerprint;
  permissions?: PermissionsFingerprint;
  clientRects?: ClientRectsFingerprint;
  webgpu?: WebGPUFingerprint;
  speechVoices?: SpeechVoicesFingerprint;
  automation?: AutomationFingerprint;
  uiLanguage?: UILanguageFingerprint;
  timestamp: number;
}

export interface ConsistencyCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}
