import type { AutomationFingerprint } from '@/types/fingerprint';

export function detectAutomation(): AutomationFingerprint {
  const automation: AutomationFingerprint = {
    webdriver: undefined,
    chromeRuntime: undefined,
    automationFlags: {
      hasAutomationFlag: false,
      hasChromeAutomation: false,
    },
    otherFlags: {},
  };

  // 检测 navigator.webdriver
  if ('webdriver' in navigator) {
    automation.webdriver = (navigator as any).webdriver;
  }

  // 检测 window.chrome.runtime
  if (typeof window !== 'undefined' && (window as any).chrome) {
    automation.chromeRuntime = !!(window as any).chrome.runtime;
  }

  // 检测自动化标志（通过检查 navigator 属性）
  const nav = navigator as any;
  
  // 检查是否有 automation 相关属性
  if ('__webdriver_evaluate' in nav || '__selenium_evaluate' in nav) {
    automation.automationFlags.hasAutomationFlag = true;
  }

  // 检查 Chrome automation
  if (nav.__driver_evaluate || nav.__webdriver_script_fn) {
    automation.automationFlags.hasChromeAutomation = true;
  }

  // 检查其他可能的自动化标志
  const suspiciousProps = [
    '__webdriver_script_fn',
    '__driver_evaluate',
    '__selenium_evaluate',
    '__webdriver_evaluate',
    '__fxdriver_evaluate',
    '__driver_unwrapped',
    '__webdriver_unwrapped',
    '__selenium_unwrapped',
    '__fxdriver_unwrapped',
    '_selenium',
    '_Selenium_IDE_Recorder',
    '_selenium',
    'calledSelenium',
    '_selenium',
    'domAutomation',
    'domAutomationController',
  ];

  suspiciousProps.forEach(prop => {
    if (prop in nav) {
      automation.otherFlags[prop] = nav[prop];
    }
  });

  // 检查 document 上的自动化标志
  if (typeof document !== 'undefined') {
    const doc = document as any;
    if ('$cdc_' in doc || '$chrome_asyncScriptInfo' in doc || '__$webdriverAsyncExecutor' in doc) {
      automation.otherFlags.documentFlags = true;
    }
  }

  return automation;
}
