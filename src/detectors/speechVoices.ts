import type { SpeechVoicesFingerprint } from '@/types/fingerprint';

export function detectSpeechVoices(): SpeechVoicesFingerprint {
  if (!('speechSynthesis' in window) || !window.speechSynthesis) {
    return {
      voices: [],
      count: 0,
    };
  }

  const synth = window.speechSynthesis;
  const voices = synth.getVoices();

  return {
    voices: voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      voiceURI: voice.voiceURI,
      localService: voice.localService,
      default: voice.default || false,
    })),
    count: voices.length,
  };
}

// 注意：某些浏览器需要等待 voiceschanged 事件
export async function detectSpeechVoicesAsync(): Promise<SpeechVoicesFingerprint> {
  if (!('speechSynthesis' in window) || !window.speechSynthesis) {
    return {
      voices: [],
      count: 0,
    };
  }

  const synth = window.speechSynthesis;
  
  // 如果已经有 voices，直接返回
  let voices = synth.getVoices();
  if (voices.length > 0) {
    return {
      voices: voices.map(voice => ({
        name: voice.name,
        lang: voice.lang,
        voiceURI: voice.voiceURI,
        localService: voice.localService,
        default: voice.default || false,
      })),
      count: voices.length,
    };
  }

  // 等待 voiceschanged 事件
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      voices = synth.getVoices();
      resolve({
        voices: voices.map(voice => ({
          name: voice.name,
          lang: voice.lang,
          voiceURI: voice.voiceURI,
          localService: voice.localService,
          default: voice.default || false,
        })),
        count: voices.length,
      });
    }, 1000);

    const handler = () => {
      clearTimeout(timeout);
      voices = synth.getVoices();
      resolve({
        voices: voices.map(voice => ({
          name: voice.name,
          lang: voice.lang,
          voiceURI: voice.voiceURI,
          localService: voice.localService,
          default: voice.default || false,
        })),
        count: voices.length,
      });
      synth.removeEventListener('voiceschanged', handler);
    };

    synth.addEventListener('voiceschanged', handler);
  });
}
