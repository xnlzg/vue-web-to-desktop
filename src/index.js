/**
 * vue-web-to-desktop
 * 零配置的 Vue 插件，通过 PWA 技术将 Web 应用无缝转换为桌面应用
 * 
 * @author vue-web-to-desktop
 * @license MIT
 */

import { injectManifest, revokeManifest } from './manifest.js';
import { registerServiceWorker } from './service-worker.js';
import { InstallPromptUI } from './install-prompt.js';
import { platform, storage } from './utils.js';

/**
 * 默认配置
 */
const defaultOptions = {
  // 延迟显示时间 (毫秒)
  delay: 500,
  // 主题色
  themeColor: '#4f46e5',
  // 忽略后静默天数
  dismissExpire: 7,
  // 是否在控制台输出日志
  debug: false,
  // 自定义国际化文案
  customI18n: null,
  // 自定义 Manifest 配置
  manifestOptions: null,
  // 回调函数
  onInstalled: null,
  onDismiss: null,
  onBeforeShow: null
};

/**
 * WebToDesktop 核心类
 */
class WebToDesktop {
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options };
    this.manifestUrl = null;
    this.promptUI = null;
    this.deferredPrompt = null;
    this.isInitialized = false;

    // 绑定方法
    this.handleBeforeInstallPrompt = this.handleBeforeInstallPrompt.bind(this);
    this.handleAppInstalled = this.handleAppInstalled.bind(this);
  }

  /**
   * 日志输出
   */
  log(...args) {
    if (this.options.debug) {
      console.log('[vue-web-to-desktop]', ...args);
    }
  }

  /**
   * 初始化
   */
  async init() {
    if (this.isInitialized) {
      this.log('已初始化，跳过');
      return;
    }

    this.log('开始初始化...');

    // 检查是否已在 PWA 模式运行
    if (platform.isStandalone()) {
      this.log('已在独立模式运行，跳过初始化');
      return;
    }

    // 检查是否在静默期内
    if (storage.isDismissed(this.options.dismissExpire)) {
      this.log('用户在静默期内，跳过显示');
      return;
    }

    // 检查是否已安装
    if (storage.isInstalled()) {
      this.log('应用已安装，跳过显示');
      return;
    }

    // 注入 Manifest
    this.manifestUrl = injectManifest({
      themeColor: this.options.themeColor,
      ...this.options.manifestOptions
    });
    this.log('Manifest 已注入');

    // 注册 Service Worker
    await registerServiceWorker();

    // 监听安装事件
    this.setupEventListeners();

    this.isInitialized = true;
    this.log('初始化完成');
  }

  /**
   * 设置事件监听
   */
  setupEventListeners() {
    // 监听 beforeinstallprompt 事件
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);

    // 监听 appinstalled 事件
    window.addEventListener('appinstalled', this.handleAppInstalled);

    // iOS Safari 特殊处理
    if (platform.isIOSSafari()) {
      this.log('检测到 iOS Safari，使用引导模式');
      this.scheduleShow();
    }
  }

  /**
   * 处理 beforeinstallprompt 事件
   */
  handleBeforeInstallPrompt(event) {
    this.log('收到 beforeinstallprompt 事件');

    // 阻止默认行为
    event.preventDefault();

    // 保存事件
    this.deferredPrompt = event;

    // 延迟显示安装提示弹窗
    this.scheduleShow();
  }

  /**
   * 处理 appinstalled 事件
   */
  handleAppInstalled() {
    this.log('应用已安装');
    storage.setInstalled();

    if (this.promptUI) {
      this.promptUI.showSuccess();
    }

    if (this.options.onInstalled) {
      this.options.onInstalled();
    }
  }

  /**
   * 延迟显示安装提示
   */
  scheduleShow() {
    setTimeout(() => {
      this.showPrompt();
    }, this.options.delay);
  }

  /**
   * 显示安装提示
   */
  showPrompt() {
    // 避免重复显示
    if (this.promptUI) {
      this.log('弹窗已在显示中');
      return;
    }

    // 触发 beforeShow 回调
    if (this.options.onBeforeShow) {
      const shouldShow = this.options.onBeforeShow();
      if (shouldShow === false) {
        this.log('onBeforeShow 返回 false，取消显示');
        return;
      }
    }

    // 创建 UI
    this.promptUI = new InstallPromptUI({
      themeColor: this.options.themeColor,
      customI18n: this.options.customI18n,
      onInstalled: this.options.onInstalled,
      onDismiss: this.options.onDismiss
    });

    // 设置延迟事件
    if (this.deferredPrompt) {
      this.promptUI.setDeferredPrompt(this.deferredPrompt);
    }

    // 显示
    this.promptUI.show();
    this.log('安装提示已显示');
  }

  /**
   * 手动触发安装
   */
  async install() {
    if (!this.deferredPrompt) {
      this.log('没有可用的安装事件');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        storage.setInstalled();
        return true;
      }
      return false;
    } catch (error) {
      console.error('[vue-web-to-desktop] 安装失败', error);
      return false;
    }
  }

  /**
   * 隐藏安装提示
   */
  hide() {
    if (this.promptUI) {
      this.promptUI.hide();
    }
  }

  /**
   * 销毁
   */
  destroy() {
    // 移除事件监听
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', this.handleAppInstalled);

    // 销毁 UI
    if (this.promptUI) {
      this.promptUI.destroy();
      this.promptUI = null;
    }

    // 清理 Manifest URL
    if (this.manifestUrl) {
      revokeManifest(this.manifestUrl);
      this.manifestUrl = null;
    }

    this.isInitialized = false;
    this.log('已销毁');
  }

  /**
   * 检查是否可以安装
   */
  canInstall() {
    return !!this.deferredPrompt || platform.isIOSSafari();
  }

  /**
   * 检查是否已安装
   */
  isInstalled() {
    return storage.isInstalled() || platform.isStandalone();
  }

  /**
   * 手动显示安装提示（忽略延迟和静默期）
   */
  showPromptManual() {
    if (platform.isStandalone()) {
      this.log('已在独立模式运行，无法显示安装提示');
      return false;
    }

    // 隐藏已有的弹窗
    if (this.promptUI) {
      this.promptUI.hide();
      this.promptUI = null;
    }

    // 创建 UI
    this.promptUI = new InstallPromptUI({
      themeColor: this.options.themeColor,
      customI18n: this.options.customI18n,
      onInstalled: this.options.onInstalled,
      onDismiss: this.options.onDismiss
    });

    // 设置延迟事件
    if (this.deferredPrompt) {
      this.promptUI.setDeferredPrompt(this.deferredPrompt);
    }

    // 显示
    this.promptUI.show();
    this.log('手动显示安装提示');
    return true;
  }

  /**
   * 重置静默期状态（允许再次显示安装提示）
   */
  resetDismissState() {
    storage.clear();
    this.log('静默期已重置');
  }

  /**
   * 更新配置选项
   * @param {Object} newOptions 新配置
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.log('配置已更新', this.options);
  }

  /**
   * 获取当前配置
   */
  getOptions() {
    return { ...this.options };
  }

  /**
   * 获取平台信息
   */
  getPlatformInfo() {
    return {
      isIOS: platform.isIOS(),
      isIOSSafari: platform.isIOSSafari(),
      isAndroid: platform.isAndroid(),
      isMobile: platform.isMobile(),
      isMacOS: platform.isMacOS(),
      isWindows: platform.isWindows(),
      isLinux: platform.isLinux(),
      supportsPWA: platform.supportsPWA(),
      isStandalone: platform.isStandalone()
    };
  }
}

/**
 * Vue 插件定义
 */
const WebToDesktopPlugin = {
  /**
   * Vue 3 安装方法
   */
  install(app, options = {}) {
    const instance = new WebToDesktop(options);

    // 注入全局属性
    app.config.globalProperties.$webToDesktop = instance;

    // 提供依赖注入
    app.provide('webToDesktop', instance);

    // 自动初始化
    if (typeof window !== 'undefined') {
      // 等待 DOM 准备好
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => instance.init());
      } else {
        instance.init();
      }
    }
  }
};

/**
 * Vue 2 兼容安装
 */
if (typeof window !== 'undefined' && window.Vue) {
  // 检测 Vue 版本
  const Vue = window.Vue;
  const version = Vue.version ? parseInt(Vue.version.split('.')[0], 10) : 2;

  if (version === 2) {
    // Vue 2 安装逻辑
    WebToDesktopPlugin.install = function (Vue, options = {}) {
      const instance = new WebToDesktop(options);

      // 注入到 Vue 原型
      Vue.prototype.$webToDesktop = instance;

      // 全局混入
      Vue.mixin({
        beforeCreate() {
          this.$webToDesktop = instance;
        }
      });

      // 自动初始化
      if (typeof window !== 'undefined') {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => instance.init());
        } else {
          instance.init();
        }
      }
    };
  }
}

// 导出
export { WebToDesktop, WebToDesktopPlugin };
export default WebToDesktopPlugin;

// 工具函数导出
export { platform, storage } from './utils.js';
export { getI18nTexts, defaultI18n } from './i18n.js';
