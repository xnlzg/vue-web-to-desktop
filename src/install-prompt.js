/**
 * 安装提示 UI 组件
 * 纯 DOM 实现，不依赖框架
 */

import { getI18nTexts } from './i18n.js';
import { platform, storage, getPageIcon, getPageTitle } from './utils.js';
import { injectStyles } from './styles.js';

/**
 * 图标 SVG
 */
const icons = {
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  loading: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="vtd-spinner"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>`
};

/**
 * 安装提示 UI 管理器
 */
export class InstallPromptUI {
  constructor(options = {}) {
    this.options = options;
    this.container = null;
    this.deferredPrompt = null;
    this.texts = getI18nTexts(options.customI18n);
    this.isIOS = platform.isIOSSafari();
    this.isAutoMode = options.installMode === 'auto';

    // 绑定方法
    this.handleInstall = this.handleInstall.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  /**
   * 设置延迟安装事件
   */
  setDeferredPrompt(event) {
    this.deferredPrompt = event;
  }

  /**
   * 显示安装提示
   */
  show() {
    if (this.container) return;

    // 注入样式
    injectStyles(this.options.themeColor);

    // 创建容器
    this.container = document.createElement('div');
    this.container.className = 'vtd-container';

    if (this.isIOS) {
      this.container.innerHTML = this.renderIOSContent();
    } else if (this.isAutoMode) {
      this.container.innerHTML = this.renderAutoInstallContent();
    } else {
      this.container.innerHTML = this.renderDefaultContent();
    }

    document.body.appendChild(this.container);

    // 绑定事件
    this.bindEvents();

    // 如果是自动模式，立即触发安装
    if (this.isAutoMode && !this.isIOS) {
      this.triggerAutoInstall();
    }
  }

  /**
   * 渲染默认内容 (支持一键安装的平台 - 手动模式)
   */
  renderDefaultContent() {
    const icon = getPageIcon();
    const appName = getPageTitle();

    return `
      <div class="vtd-card">
        <button class="vtd-close" aria-label="关闭">${icons.close}</button>
        <div class="vtd-header">
          <img class="vtd-icon" src="${icon}" alt="${appName}" onerror="this.style.display='none'">
          <div class="vtd-title-wrap">
            <h3 class="vtd-title">${this.texts.title}</h3>
            <p class="vtd-app-name">${appName}</p>
          </div>
        </div>
        <p class="vtd-description">${this.texts.description}</p>
        <div class="vtd-buttons">
          <button class="vtd-btn vtd-btn-secondary vtd-dismiss-btn">${this.texts.dismissButton}</button>
          <button class="vtd-btn vtd-btn-primary vtd-install-btn">
            ${icons.download}
            ${this.texts.installButton}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 渲染自动安装内容 (显示安装中状态)
   */
  renderAutoInstallContent() {
    const icon = getPageIcon();
    const appName = getPageTitle();

    return `
      <div class="vtd-card">
        <div class="vtd-header">
          <img class="vtd-icon" src="${icon}" alt="${appName}" onerror="this.style.display='none'">
          <div class="vtd-title-wrap">
            <h3 class="vtd-title">${appName}</h3>
            <p class="vtd-app-name">${this.texts.installing}</p>
          </div>
        </div>
        <div class="vtd-installing">
          <div class="vtd-installing-spinner">${icons.loading}</div>
          <p class="vtd-installing-text">${this.texts.installingDescription}</p>
        </div>
      </div>
    `;
  }

  /**
   * 渲染 iOS 内容 (引导添加到主屏幕)
   */
  renderIOSContent() {
    const icon = getPageIcon();
    const appName = getPageTitle();

    return `
      <div class="vtd-card">
        <button class="vtd-close" aria-label="关闭">${icons.close}</button>
        <div class="vtd-header">
          <img class="vtd-icon" src="${icon}" alt="${appName}" onerror="this.style.display='none'">
          <div class="vtd-title-wrap">
            <h3 class="vtd-title">${this.texts.iosTitle}</h3>
            <p class="vtd-app-name">${appName}</p>
          </div>
        </div>
        <p class="vtd-description">${this.texts.description}</p>
        <div class="vtd-ios-guide">
          <div class="vtd-ios-title">
            ${icons.info}
            安装步骤
          </div>
          <ol class="vtd-ios-steps">
            <li class="vtd-ios-step">
              <span class="vtd-step-num">1</span>
              <span class="vtd-step-text">${this.texts.iosStep1}</span>
            </li>
            <li class="vtd-ios-step">
              <span class="vtd-step-num">2</span>
              <span class="vtd-step-text">${this.texts.iosStep2}</span>
            </li>
            <li class="vtd-ios-step">
              <span class="vtd-step-num">3</span>
              <span class="vtd-step-text">${this.texts.iosStep3}</span>
            </li>
          </ol>
        </div>
        <div class="vtd-buttons" style="margin-top: 16px;">
          <button class="vtd-btn vtd-btn-secondary vtd-dismiss-btn">${this.texts.dismissButton}</button>
        </div>
      </div>
    `;
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    if (!this.container) return;

    // 关闭按钮
    const closeBtn = this.container.querySelector('.vtd-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', this.handleDismiss);
    }

    // 安装按钮
    const installBtn = this.container.querySelector('.vtd-install-btn');
    if (installBtn) {
      installBtn.addEventListener('click', this.handleInstall);
    }

    // 暂不安装按钮
    const dismissBtn = this.container.querySelector('.vtd-dismiss-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', this.handleDismiss);
    }
  }

  /**
   * 触发自动安装
   */
  async triggerAutoInstall() {
    if (!this.deferredPrompt) {
      console.warn('[vue-web-to-desktop] 没有可用的安装事件');
      this.hide();
      return;
    }

    try {
      // 触发安装提示
      this.deferredPrompt.prompt();

      // 等待用户响应
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('[vue-web-to-desktop] 用户已接受安装');
        storage.setInstalled();
        this.showSuccess();
      } else {
        console.log('[vue-web-to-desktop] 用户已取消安装');
        storage.setDismissed();
        this.hide();
        if (this.options.onDismiss) {
          this.options.onDismiss();
        }
      }
    } catch (error) {
      console.error('[vue-web-to-desktop] 安装出错', error);
      this.hide();
    }

    // 清除延迟事件
    this.deferredPrompt = null;
  }

  /**
   * 处理安装
   */
  async handleInstall() {
    if (!this.deferredPrompt) {
      console.warn('[vue-web-to-desktop] 没有可用的安装事件');
      return;
    }

    // 显示安装中状态
    this.showInstalling();

    try {
      // 触发安装提示
      this.deferredPrompt.prompt();

      // 等待用户响应
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('[vue-web-to-desktop] 用户已接受安装');
        storage.setInstalled();
        this.showSuccess();
      } else {
        console.log('[vue-web-to-desktop] 用户已取消安装');
        this.handleDismiss();
      }
    } catch (error) {
      console.error('[vue-web-to-desktop] 安装出错', error);
      this.handleDismiss();
    }

    // 清除延迟事件
    this.deferredPrompt = null;
  }

  /**
   * 显示安装中状态
   */
  showInstalling() {
    if (!this.container) return;

    const card = this.container.querySelector('.vtd-card');
    if (card) {
      const icon = getPageIcon();
      const appName = getPageTitle();
      card.innerHTML = `
        <div class="vtd-header">
          <img class="vtd-icon" src="${icon}" alt="${appName}" onerror="this.style.display='none'">
          <div class="vtd-title-wrap">
            <h3 class="vtd-title">${appName}</h3>
            <p class="vtd-app-name">${this.texts.installing}</p>
          </div>
        </div>
        <div class="vtd-installing">
          <div class="vtd-installing-spinner">${icons.loading}</div>
          <p class="vtd-installing-text">${this.texts.installingDescription}</p>
        </div>
      `;
    }
  }

  /**
   * 处理忽略
   */
  handleDismiss() {
    storage.setDismissed();
    this.hide();

    // 触发回调
    if (this.options.onDismiss) {
      this.options.onDismiss();
    }
  }

  /**
   * 显示成功状态
   */
  showSuccess() {
    if (!this.container) return;

    const card = this.container.querySelector('.vtd-card');
    if (card) {
      card.innerHTML = `
        <div class="vtd-success">
          <div class="vtd-success-icon">${icons.check}</div>
          <h3 class="vtd-success-title">${this.texts.installedTitle}</h3>
          <p class="vtd-success-desc">${this.texts.installedDescription}</p>
        </div>
      `;
    }

    // 3秒后自动隐藏
    setTimeout(() => {
      this.hide();
      if (this.options.onInstalled) {
        this.options.onInstalled();
      }
    }, 3000);
  }

  /**
   * 隐藏提示
   */
  hide() {
    if (this.container) {
      // 添加退出动画
      this.container.style.transition = 'opacity 0.3s, transform 0.3s';
      this.container.style.opacity = '0';
      this.container.style.transform = 'translateY(20px)';

      setTimeout(() => {
        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
      }, 300);
    }
  }

  /**
   * 销毁
   */
  destroy() {
    this.hide();
    this.deferredPrompt = null;
  }
}
