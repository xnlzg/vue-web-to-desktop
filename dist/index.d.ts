/**
 * vue-web-to-desktop TypeScript 类型声明
 */

declare module 'vue-web-to-desktop' {
  import { App, Plugin } from 'vue';

  export interface I18nTexts {
    title: string;
    description: string;
    installButton: string;
    dismissButton: string;
    iosTitle: string;
    iosStep1: string;
    iosStep2: string;
    iosStep3: string;
    installedTitle: string;
    installedDescription: string;
  }

  export interface CustomI18n {
    'zh-CN'?: Partial<I18nTexts>;
    'zh-TW'?: Partial<I18nTexts>;
    'en'?: Partial<I18nTexts>;
    'ja'?: Partial<I18nTexts>;
    'ko'?: Partial<I18nTexts>;
    [key: string]: Partial<I18nTexts> | undefined;
  }

  export interface ManifestOptions {
    name?: string;
    shortName?: string;
    description?: string;
    themeColor?: string;
    backgroundColor?: string;
    display?: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
    orientation?: 'any' | 'portrait' | 'landscape';
    startUrl?: string;
    scope?: string;
    icons?: Array<{
      src: string;
      sizes: string;
      type: string;
      purpose?: string;
    }>;
  }

  export interface WebToDesktopOptions {
    /** 延迟显示时间 (毫秒)，默认 500 */
    delay?: number;
    /** 主题色，默认 '#4f46e5' */
    themeColor?: string;
    /** 忽略后静默天数，默认 7 */
    dismissExpire?: number;
    /** 是否在控制台输出日志，默认 false */
    debug?: boolean;
    /** 自定义国际化文案 */
    customI18n?: CustomI18n;
    /** 自定义 Manifest 配置 */
    manifestOptions?: ManifestOptions;
    /** 安装成功回调 */
    onInstalled?: () => void;
    /** 用户忽略回调 */
    onDismiss?: () => void;
    /** 显示前回调，返回 false 可阻止显示 */
    onBeforeShow?: () => boolean | void;
  }

  export interface PlatformInfo {
    isIOS: boolean;
    isIOSSafari: boolean;
    isAndroid: boolean;
    isMobile: boolean;
    isMacOS: boolean;
    isWindows: boolean;
    isLinux: boolean;
    supportsPWA: boolean;
    isStandalone: boolean;
  }

  export class WebToDesktop {
    constructor(options?: WebToDesktopOptions);

    /** 初始化 */
    init(): Promise<void>;

    /** 手动触发安装 */
    install(): Promise<boolean>;

    /** 隐藏安装提示 */
    hide(): void;

    /** 销毁实例 */
    destroy(): void;

    /** 检查是否可以安装 */
    canInstall(): boolean;

    /** 检查是否已安装 */
    isInstalled(): boolean;

    /** 手动显示安装提示（忽略延迟和静默期） */
    showPromptManual(): boolean;

    /** 重置静默期状态（允许再次显示安装提示） */
    resetDismissState(): void;

    /** 更新配置选项 */
    updateOptions(newOptions: Partial<WebToDesktopOptions>): void;

    /** 获取当前配置 */
    getOptions(): WebToDesktopOptions;

    /** 获取平台信息 */
    getPlatformInfo(): PlatformInfo;
  }

  export const platform: {
    isIOSSafari(): boolean;
    isIOS(): boolean;
    isAndroid(): boolean;
    isMobile(): boolean;
    isMacOS(): boolean;
    isWindows(): boolean;
    isLinux(): boolean;
    supportsPWA(): boolean;
    isStandalone(): boolean;
  };

  export const storage: {
    setDismissed(): void;
    isDismissed(expireDays: number): boolean;
    setInstalled(): void;
    isInstalled(): boolean;
    clear(): void;
  };

  export function getI18nTexts(customI18n?: CustomI18n): I18nTexts;

  export const defaultI18n: {
    [key: string]: I18nTexts;
  };

  export const WebToDesktopPlugin: Plugin;

  export default WebToDesktopPlugin;
}

// Vue 3 组件增强
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $webToDesktop: import('vue-web-to-desktop').WebToDesktop;
  }
}

// Vue 2 组件增强
declare module 'vue/types/vue' {
  interface Vue {
    $webToDesktop: import('vue-web-to-desktop').WebToDesktop;
  }
}
