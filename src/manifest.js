/**
 * 动态 Manifest 生成器
 * 使用 Blob 和 URL.createObjectURL 动态创建 Manifest
 */

import { generateAppId, getPageIcon, getPageTitle, getThemeColor } from './utils.js';

/**
 * 生成 Manifest 对象
 * @param {Object} options 配置选项
 * @returns {Object} Manifest 对象
 */
export function generateManifest(options = {}) {
  const {
    name = getPageTitle(),
    shortName = name || getPageTitle(),
    description = '',
    themeColor = getThemeColor(),
    backgroundColor = '#ffffff',
    display = 'standalone',
    orientation = 'any',
    startUrl = location.href,
    scope = location.origin,
    icons = null
  } = options;

  const iconUrl = getPageIcon();
  const appId = generateAppId();

  const defaultIcons = [
    {
      src: iconUrl,
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: iconUrl,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
  ];

  return {
    id: appId,
    name: name,
    short_name: shortName,
    description: description || `${name} - 桌面应用`,
    theme_color: themeColor,
    background_color: backgroundColor,
    display: display,
    orientation: orientation,
    start_url: startUrl,
    scope: scope,
    icons: icons || defaultIcons,
    categories: ['productivity', 'utilities'],
    prefer_related_applications: false
  };
}

/**
 * 动态注入 Manifest
 * @param {Object} options 配置选项
 * @returns {string} Manifest 的 Blob URL
 */
export function injectManifest(options = {}) {
  // 移除已存在的 manifest link
  const existingLink = document.querySelector('link[rel="manifest"]');
  if (existingLink) {
    existingLink.remove();
  }

  // 生成 manifest
  const manifest = generateManifest(options);
  const manifestString = JSON.stringify(manifest, null, 2);

  // 创建 Blob URL
  const blob = new Blob([manifestString], { type: 'application/json' });
  const manifestUrl = URL.createObjectURL(blob);

  // 注入到页面
  const link = document.createElement('link');
  link.rel = 'manifest';
  link.href = manifestUrl;
  document.head.appendChild(link);

  return manifestUrl;
}

/**
 * 清理 Manifest URL (防止内存泄漏)
 * @param {string} manifestUrl 
 */
export function revokeManifest(manifestUrl) {
  if (manifestUrl) {
    URL.revokeObjectURL(manifestUrl);
  }
}
