/**
 * 安装提示组件样式
 * 内联 CSS，避免外部依赖
 */

export function getStyles(themeColor = '#4f46e5') {
  // 计算相关颜色
  const lighterColor = adjustColor(themeColor, 40);
  const darkerColor = adjustColor(themeColor, -20);

  return `
    /* 容器 */
    .vtd-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1f2937;
      box-sizing: border-box;
    }

    .vtd-container *, 
    .vtd-container *::before, 
    .vtd-container *::after {
      box-sizing: inherit;
    }

    /* 卡片 */
    .vtd-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.1);
      padding: 20px;
      min-width: 320px;
      max-width: 380px;
      animation: vtd-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: bottom right;
    }

    @keyframes vtd-slide-up {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* 关闭按钮 */
    .vtd-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      border: none;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: all 0.2s ease;
      padding: 0;
    }

    .vtd-close:hover {
      background: rgba(0, 0, 0, 0.1);
      color: #374151;
    }

    .vtd-close svg {
      width: 14px;
      height: 14px;
    }

    /* 头部 */
    .vtd-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
      padding-right: 20px;
    }

    .vtd-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      object-fit: cover;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    .vtd-title-wrap {
      flex: 1;
      min-width: 0;
    }

    .vtd-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .vtd-app-name {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 描述 */
    .vtd-description {
      color: #4b5563;
      font-size: 13px;
      margin-bottom: 18px;
      line-height: 1.6;
    }

    /* 按钮组 */
    .vtd-buttons {
      display: flex;
      gap: 10px;
    }

    .vtd-btn {
      flex: 1;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .vtd-btn-primary {
      background: linear-gradient(135deg, ${themeColor} 0%, ${darkerColor} 100%);
      color: white;
      box-shadow: 0 4px 14px 0 ${themeColor}40;
    }

    .vtd-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px 0 ${themeColor}50;
    }

    .vtd-btn-primary:active {
      transform: translateY(0);
    }

    .vtd-btn-secondary {
      background: #f3f4f6;
      color: #4b5563;
    }

    .vtd-btn-secondary:hover {
      background: #e5e7eb;
    }

    .vtd-btn svg {
      width: 16px;
      height: 16px;
    }

    /* iOS 引导 */
    .vtd-ios-guide {
      margin-top: 16px;
      padding: 16px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .vtd-ios-title {
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 14px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .vtd-ios-steps {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .vtd-ios-step {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 8px 0;
      font-size: 13px;
      color: #475569;
    }

    .vtd-ios-step:not(:last-child) {
      border-bottom: 1px dashed #e2e8f0;
    }

    .vtd-step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: ${themeColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .vtd-step-text {
      padding-top: 2px;
    }

    /* 成功状态 */
    .vtd-success {
      text-align: center;
      padding: 10px 0;
    }

    .vtd-success-icon {
      width: 56px;
      height: 56px;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: vtd-success-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes vtd-success-pop {
      0% {
        transform: scale(0);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }

    .vtd-success-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .vtd-success-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 6px 0;
    }

    .vtd-success-desc {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }

    /* 安装中状态 */
    .vtd-installing {
      text-align: center;
      padding: 20px 0;
    }

    .vtd-installing-spinner {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      color: ${themeColor};
    }

    .vtd-installing-spinner svg {
      width: 48px;
      height: 48px;
      animation: vtd-spin 1s linear infinite;
    }

    @keyframes vtd-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .vtd-installing-text {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    /* 移动端适配 */
    @media (max-width: 480px) {
      .vtd-container {
        bottom: 16px;
        right: 16px;
        left: 16px;
      }
      
      .vtd-card {
        min-width: auto;
        max-width: none;
        width: 100%;
      }
    }

    /* 深色模式 */
    @media (prefers-color-scheme: dark) {
      .vtd-card {
        background: rgba(30, 30, 30, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .vtd-title {
        color: #f9fafb;
      }
      
      .vtd-app-name {
        color: #9ca3af;
      }
      
      .vtd-description {
        color: #d1d5db;
      }
      
      .vtd-close {
        background: rgba(255, 255, 255, 0.1);
        color: #9ca3af;
      }
      
      .vtd-close:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #e5e7eb;
      }
      
      .vtd-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #d1d5db;
      }
      
      .vtd-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      
      .vtd-ios-guide {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .vtd-ios-title {
        color: #f1f5f9;
      }
      
      .vtd-ios-step {
        color: #cbd5e1;
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .vtd-success-title {
        color: #f9fafb;
      }
      
      .vtd-success-desc {
        color: #9ca3af;
      }
    }
  `;
}

/**
 * 调整颜色亮度
 * @param {string} color 十六进制颜色
 * @param {number} percent 调整百分比 (-100 到 100)
 */
function adjustColor(color, percent) {
  // 处理带 # 的颜色
  const hex = color.replace('#', '');

  // 解析 RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // 调整
  r = Math.min(255, Math.max(0, r + (r * percent / 100)));
  g = Math.min(255, Math.max(0, g + (g * percent / 100)));
  b = Math.min(255, Math.max(0, b + (b * percent / 100)));

  // 转回十六进制
  const toHex = (n) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * 注入样式到页面
 */
export function injectStyles(themeColor) {
  const styleId = 'vue-web-to-desktop-styles';

  // 如果已存在则移除
  const existing = document.getElementById(styleId);
  if (existing) {
    existing.remove();
  }

  // 创建新样式
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = getStyles(themeColor);
  document.head.appendChild(style);
}
