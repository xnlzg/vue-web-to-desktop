/**
 * 工具函数
 */

/**
 * 平台检测工具
 */
export const platform = {
  /**
   * 是否为 iOS Safari
   */
  isIOSSafari() {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /Safari/.test(ua) && !/CriOS|Chrome/.test(ua);
    return isIOS && isSafari;
  },

  /**
   * 是否为 iOS 设备
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },

  /**
   * 是否为 Android 设备
   */
  isAndroid() {
    return /Android/.test(navigator.userAgent);
  },

  /**
   * 是否为移动设备
   */
  isMobile() {
    return this.isIOS() || this.isAndroid();
  },

  /**
   * 是否为 macOS
   */
  isMacOS() {
    return /Macintosh|MacIntel/.test(navigator.userAgent);
  },

  /**
   * 是否为 Windows
   */
  isWindows() {
    return /Windows/.test(navigator.userAgent);
  },

  /**
   * 是否为 Linux
   */
  isLinux() {
    return /Linux/.test(navigator.userAgent) && !this.isAndroid();
  },

  /**
   * 是否支持 PWA 安装
   */
  supportsPWA() {
    return 'serviceWorker' in navigator &&
      ('BeforeInstallPromptEvent' in window || this.isIOSSafari());
  },

  /**
   * 是否已在独立模式下运行 (PWA 已安装)
   */
  isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
  }
};

/**
 * 存储工具 - 处理频控逻辑
 */
export const storage = {
  PREFIX: 'vue-web-to-desktop:',

  /**
   * 获取存储键名
   * @param {string} key 
   */
  getKey(key) {
    return `${this.PREFIX}${location.hostname}:${key}`;
  },

  /**
   * 设置dismissal时间
   */
  setDismissed() {
    const key = this.getKey('dismissed');
    localStorage.setItem(key, Date.now().toString());
  },

  /**
   * 检查是否在静默期内
   * @param {number} expireDays 静默天数
   */
  isDismissed(expireDays) {
    const key = this.getKey('dismissed');
    const timestamp = localStorage.getItem(key);

    if (!timestamp) return false;

    const dismissedTime = parseInt(timestamp, 10);
    const expireTime = expireDays * 24 * 60 * 60 * 1000;

    return Date.now() - dismissedTime < expireTime;
  },

  /**
   * 标记已安装
   */
  setInstalled() {
    const key = this.getKey('installed');
    localStorage.setItem(key, 'true');
  },

  /**
   * 检查是否已安装
   */
  isInstalled() {
    const key = this.getKey('installed');
    return localStorage.getItem(key) === 'true';
  },

  /**
   * 清除所有存储
   */
  clear() {
    const prefix = this.getKey('');
    Object.keys(localStorage)
      .filter(key => key.startsWith(prefix))
      .forEach(key => localStorage.removeItem(key));
  }
};

/**
 * 生成唯一应用ID (基于hostname)
 */
export function generateAppId() {
  const hostname = location.hostname;
  // 简单的哈希算法生成唯一ID
  let hash = 0;
  for (let i = 0; i < hostname.length; i++) {
    const char = hostname.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `pwa-${Math.abs(hash).toString(36)}`;
}

/**
 * 获取页面图标
 */
export function getPageIcon() {
  // 尝试获取 apple-touch-icon
  const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
  if (appleIcon) return appleIcon.href;

  // 尝试获取各种图标
  const iconSelectors = [
    'link[rel="icon"][sizes="192x192"]',
    'link[rel="icon"][sizes="180x180"]',
    'link[rel="icon"][sizes="152x152"]',
    'link[rel="icon"][sizes="144x144"]',
    'link[rel="icon"][sizes="128x128"]',
    'link[rel="icon"][sizes="96x96"]',
    'link[rel="icon"][type="image/png"]',
    'link[rel="shortcut icon"]',
    'link[rel="icon"]'
  ];

  for (const selector of iconSelectors) {
    const icon = document.querySelector(selector);
    if (icon && icon.href) return icon.href;
  }

  // 默认 favicon
  return `${location.origin}/favicon.ico`;
}

/**
 * 获取页面标题
 */
export function getPageTitle() {
  return document.title || location.hostname;
}

/**
 * 获取主题色
 */
export function getThemeColor() {
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  return metaTheme ? metaTheme.content : '#4f46e5';
}
