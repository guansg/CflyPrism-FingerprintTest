import { detectNavigator } from './navigator';
import { detectScreen } from './screen';
import { detectViewport } from './viewport';
import { detectCanvas } from './canvas';
import { detectWebGL } from './webgl';
import { detectAudio } from './audio';
import { detectFonts } from './fonts';
import { detectMediaDevices } from './mediaDevices';
import { detectWebRTC } from './webrtc';
import { detectTimezone } from './timezone';
import { detectGeolocation } from './geolocation';
import { detectPermissions } from './permissions';
import { detectClientRects } from './clientRects';
import { detectWebGPU } from './webgpu';
import { detectSpeechVoicesAsync } from './speechVoices';
import { detectAutomation } from './automation';
import { detectUILanguage } from './uiLanguage';
import type { FingerprintData } from '@/types/fingerprint';
import type { DetectionOptions } from '@/types/detection';

export async function detectAllFingerprints(options?: DetectionOptions): Promise<FingerprintData> {
  const opts = options || {
    navigator: true,
    screen: true,
    viewport: true,
    timezone: true,
    canvas: true,
    webgl: true,
    webgpu: true,
    audio: true,
    fonts: true,
    mediaDevices: true,
    speechVoices: true,
    webrtc: true,
    geolocation: true,
    permissions: true,
    clientRects: true,
    automation: true,
    uiLanguage: true,
  };

  const tasks: Array<Promise<any>> = [];
  const taskKeys: string[] = [];

  if (opts.navigator) {
    tasks.push(detectNavigator());
    taskKeys.push('navigator');
  }
  if (opts.screen) {
    tasks.push(Promise.resolve(detectScreen()));
    taskKeys.push('screen');
  }
  if (opts.viewport) {
    tasks.push(Promise.resolve(detectViewport()));
    taskKeys.push('viewport');
  }
  if (opts.canvas) {
    tasks.push(detectCanvas());
    taskKeys.push('canvas');
  }
  if (opts.webgl) {
    tasks.push(detectWebGL());
    taskKeys.push('webgl');
  }
  if (opts.audio) {
    tasks.push(detectAudio());
    taskKeys.push('audio');
  }
  if (opts.fonts) {
    tasks.push(detectFonts());
    taskKeys.push('fonts');
  }
  if (opts.mediaDevices) {
    tasks.push(detectMediaDevices());
    taskKeys.push('mediaDevices');
  }
  if (opts.webrtc) {
    tasks.push(detectWebRTC());
    taskKeys.push('webrtc');
  }
  if (opts.timezone) {
    tasks.push(Promise.resolve(detectTimezone()));
    taskKeys.push('timezone');
  }
  if (opts.geolocation) {
    tasks.push(detectGeolocation());
    taskKeys.push('geolocation');
  }
  if (opts.permissions) {
    tasks.push(detectPermissions());
    taskKeys.push('permissions');
  }
  if (opts.clientRects) {
    tasks.push(Promise.resolve(detectClientRects()));
    taskKeys.push('clientRects');
  }
  if (opts.webgpu) {
    tasks.push(detectWebGPU());
    taskKeys.push('webgpu');
  }
  if (opts.speechVoices) {
    tasks.push(detectSpeechVoicesAsync());
    taskKeys.push('speechVoices');
  }
  if (opts.automation) {
    tasks.push(Promise.resolve(detectAutomation()));
    taskKeys.push('automation');
  }
  if (opts.uiLanguage) {
    tasks.push(Promise.resolve(detectUILanguage()));
    taskKeys.push('uiLanguage');
  }

  const results = await Promise.all(tasks);

  const fingerprint: Partial<FingerprintData> = {
    timestamp: Date.now(),
  };

  taskKeys.forEach((key, index) => {
    (fingerprint as any)[key] = results[index];
  });

  return fingerprint as FingerprintData;
}
