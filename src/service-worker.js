/**
 * Service Worker 注册与管理
 * 生成最小化的 Service Worker 用于 PWA 支持
 */

/**
 * 生成 Service Worker 代码
 * @returns {string} Service Worker 代码
 */
export function generateServiceWorkerCode() {
  return `
    // vue-web-to-desktop Service Worker
    // 最小化实现，仅用于满足 PWA 安装要求
    
    const CACHE_NAME = 'vue-web-to-desktop-v1';
    
    // 安装事件
    self.addEventListener('install', (event) => {
      console.log('[vue-web-to-desktop] Service Worker 安装成功');
      self.skipWaiting();
    });
    
    // 激活事件
    self.addEventListener('activate', (event) => {
      console.log('[vue-web-to-desktop] Service Worker 激活成功');
      event.waitUntil(clients.claim());
    });
    
    // Fetch 事件 - 使用 Network First 策略，不干扰原有请求
    self.addEventListener('fetch', (event) => {
      // 直接使用网络请求，不做缓存处理
      // 这样可以保持原站点的所有功能正常运行
      event.respondWith(fetch(event.request));
    });
  `;
}

/**
 * 注册 Service Worker
 * @returns {Promise<ServiceWorkerRegistration|null>}
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[vue-web-to-desktop] 浏览器不支持 Service Worker');
    return null;
  }

  try {
    // 检查是否已有 Service Worker 注册
    const registrations = await navigator.serviceWorker.getRegistrations();

    // 如果已有注册，直接使用
    if (registrations.length > 0) {
      console.log('[vue-web-to-desktop] 使用已有的 Service Worker');
      return registrations[0];
    }

    // 动态创建 Service Worker
    const swCode = generateServiceWorkerCode();
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);

    // 注册 Service Worker
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/'
    });

    console.log('[vue-web-to-desktop] Service Worker 注册成功');
    return registration;
  } catch (error) {
    // Blob URL 可能不被支持，尝试使用内联方式
    console.warn('[vue-web-to-desktop] 动态 SW 注册失败，使用备用方案', error);
    return null;
  }
}

/**
 * 注销 Service Worker
 */
export async function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('[vue-web-to-desktop] Service Worker 已注销');
  } catch (error) {
    console.error('[vue-web-to-desktop] Service Worker 注销失败', error);
  }
}
