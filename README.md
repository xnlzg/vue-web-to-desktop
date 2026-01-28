# vue-web-to-desktop

<p align="center">
  <img src="https://img.shields.io/npm/v/vue-web-to-desktop.svg" alt="npm version">
  <img src="https://img.shields.io/npm/l/vue-web-to-desktop.svg" alt="license">
  <img src="https://img.shields.io/npm/dm/vue-web-to-desktop.svg" alt="downloads">
  <img src="https://img.shields.io/badge/Vue-2.x%20%7C%203.x-brightgreen" alt="vue version">
</p>

<p align="center">
  <b>零配置的 Vue 插件，通过 PWA 技术将 Web 应用无缝转换为桌面应用</b>
</p>

<p align="center">
  🚀 零配置 · 🎯 Vue 2/3 支持 · 🌍 多语言 · 💎 精美 UI · 🍎 iOS 支持 · 🔒 智能频控
</p>

---

## 📖 目录

- [特性](#-特性)
- [安装](#-安装)
- [快速开始](#-快速开始)
- [配置选项](#️-配置选项)
- [API 文档](#-api-文档)
- [自定义文案](#-自定义文案)
- [高级用法](#-高级用法)
- [工作原理](#-工作原理)
- [平台支持](#-平台支持)
- [常见问题](#-常见问题)
- [更新日志](#-更新日志)
- [许可证](#-许可证)

---

## ✨ 特性

### 🚀 零配置启动 (Zero-Config)

- **自动提取** - 自动抓取网页 `<title>` 作为应用名，抓取 favicon 或 `link[rel=icon]` 作为图标
- **自动注入** - 运行时动态生成 `manifest.json` 和 Service Worker，无需手动创建任何物理文件
- **即插即用** - 无需复杂配置，引入即可使用

### 🎯 极致兼容性 (Full Compatibility)

- **Vue 2.x / 3.x** - 一套代码通过适配器逻辑同时支持 Vue 2 和 Vue 3 项目
- **TypeScript 支持** - 提供完整的 TypeScript 类型声明
- **跨平台支持** - 支持 Windows、macOS、Linux 以及 Android/iOS

### 🌍 国际化与本地化 (I18n)

- **智能识别** - 自动根据浏览器语言切换中文、英文、日文、韩文文案
- **完全定制** - 支持开发者传入 `customI18n` 覆盖内置文案
- **支持繁简体** - 自动区分简体中文和繁体中文

### 🔒 智能行为感知 (Smart Logic)

- **频控机制** - 用户点击"暂不安装"后，插件自动记录并进入 7 天静默期，避免干扰用户
- **iOS 引导补丁** - 针对 iOS Safari 不支持一键安装的特性，自动切换为"添加到主屏幕"的步骤指引
- **唯一标识** - 基于 hostname 生成应用 ID，确保同一台电脑安装不同域名下的站点不会产生冲突
- **状态检测** - 自动检测是否已安装，避免重复提示

### 💎 精美 UI

- **现代设计** - 毛玻璃效果、渐变色、动画过渡
- **深色模式** - 自动适配系统深色模式
- **响应式** - 完美适配桌面端和移动端

---

## 📦 安装

### 使用 npm

```bash
npm install vue-web-to-desktop
```

### 使用 yarn

```bash
yarn add vue-web-to-desktop
```

### 使用 pnpm

```bash
pnpm add vue-web-to-desktop
```

### 使用 CDN

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-web-to-desktop"></script>

<script>
  const app = Vue.createApp({});
  app.use(VueWebToDesktop);
  app.mount('#app');
</script>

<!-- Vue 2 -->
<script src="https://unpkg.com/vue@2"></script>
<script src="https://unpkg.com/vue-web-to-desktop"></script>

<script>
  Vue.use(VueWebToDesktop);
  new Vue({ el: '#app' });
</script>
```

---

## 🚀 快速开始

### Vue 3

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import WebToDesktop from 'vue-web-to-desktop';

const app = createApp(App);

// 使用默认配置
app.use(WebToDesktop);

// 或使用自定义配置
app.use(WebToDesktop, {
  delay: 3000,           // 延迟 3 秒弹出
  themeColor: '#4f46e5', // 主题色
  dismissExpire: 7,      // 忽略后静默 7 天
  debug: false,          // 关闭调试日志
  onInstalled: () => {
    console.log('用户已安装应用！');
  },
  onDismiss: () => {
    console.log('用户暂时不想安装');
  }
});

app.mount('#app');
```

### Vue 2

```javascript
// main.js
import Vue from 'vue';
import App from './App.vue';
import WebToDesktop from 'vue-web-to-desktop';

// 使用默认配置
Vue.use(WebToDesktop);

// 或使用自定义配置
Vue.use(WebToDesktop, {
  delay: 3000,
  themeColor: '#4f46e5',
  dismissExpire: 7
});

new Vue({
  render: h => h(App),
}).$mount('#app');
```

### Nuxt.js

```javascript
// plugins/vue-web-to-desktop.client.js
import WebToDesktop from 'vue-web-to-desktop';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(WebToDesktop, {
    delay: 3000,
    themeColor: '#4f46e5'
  });
});
```

```javascript
// nuxt.config.js
export default {
  plugins: [
    { src: '~/plugins/vue-web-to-desktop.client.js', mode: 'client' }
  ]
}
```

---

## ⚙️ 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `delay` | `number` | `500` | 延迟显示安装提示的时间（毫秒） |
| `themeColor` | `string` | `'#4f46e5'` | 主题色，用于安装按钮和提示框（十六进制格式） |
| `dismissExpire` | `number` | `7` | 用户点击"暂不安装"后的静默天数 |
| `debug` | `boolean` | `false` | 是否在控制台输出调试日志 |
| `customI18n` | `object` | `null` | 自定义国际化文案（见下文） |
| `manifestOptions` | `object` | `null` | 自定义 PWA Manifest 配置（见下文） |
| `onInstalled` | `function` | `null` | 安装成功后的回调函数 |
| `onDismiss` | `function` | `null` | 用户点击"暂不安装"后的回调函数 |
| `onBeforeShow` | `function` | `null` | 显示提示前的回调函数，返回 `false` 可阻止显示 |

### Manifest 配置选项

通过 `manifestOptions` 可以自定义 PWA Manifest：

```javascript
app.use(WebToDesktop, {
  manifestOptions: {
    name: '我的应用',              // 应用完整名称
    shortName: '应用',             // 应用短名称
    description: '这是我的应用',   // 应用描述
    themeColor: '#4f46e5',        // 主题色
    backgroundColor: '#ffffff',   // 背景色
    display: 'fullscreen',        // 显示模式: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser' (默认 fullscreen 全屏)
    orientation: 'any',           // 屏幕方向: 'any' | 'portrait' | 'landscape'
    startUrl: '/',                // 启动 URL
    scope: '/',                   // 作用域
    icons: [                      // 自定义图标数组
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
});
```

---

## 📚 API 文档

### 访问实例

在组件中可以通过 `this.$webToDesktop` 访问插件实例：

```javascript
// Vue 3 Options API
export default {
  mounted() {
    console.log('可以安装:', this.$webToDesktop.canInstall());
  }
}

// Vue 3 Composition API
import { inject } from 'vue';

export default {
  setup() {
    const webToDesktop = inject('webToDesktop');
    
    console.log('可以安装:', webToDesktop.canInstall());
    
    return { webToDesktop };
  }
}

// Vue 2
export default {
  mounted() {
    console.log('可以安装:', this.$webToDesktop.canInstall());
  }
}
```

### 实例方法

#### `init(): Promise<void>`

初始化插件。通常由插件自动调用，无需手动调用。

```javascript
await this.$webToDesktop.init();
```

#### `install(): Promise<boolean>`

手动触发安装流程。返回 `true` 表示用户接受安装，`false` 表示用户拒绝。

```javascript
const handleInstall = async () => {
  const result = await this.$webToDesktop.install();
  if (result) {
    console.log('安装成功！');
  } else {
    console.log('用户取消了安装');
  }
};
```

#### `hide(): void`

隐藏当前显示的安装提示。

```javascript
this.$webToDesktop.hide();
```

#### `destroy(): void`

销毁插件实例，移除所有事件监听和 DOM 元素。

```javascript
this.$webToDesktop.destroy();
```

#### `canInstall(): boolean`

检查当前环境是否可以安装 PWA。

```javascript
if (this.$webToDesktop.canInstall()) {
  console.log('可以安装');
}
```

#### `isInstalled(): boolean`

检查应用是否已经安装。

```javascript
if (this.$webToDesktop.isInstalled()) {
  console.log('应用已安装');
}
```

#### `showPromptManual(): boolean`

手动显示安装提示，忽略延迟和静默期设置。返回 `true` 表示成功显示，`false` 表示无法显示（如已在 PWA 模式运行）。

```javascript
// 例如：用户点击页面上的"安装应用"按钮时调用
document.getElementById('installBtn').onclick = () => {
  this.$webToDesktop.showPromptManual();
};
```

#### `resetDismissState(): void`

重置静默期状态，允许再次显示安装提示。适用于测试或用户主动请求安装的场景。

```javascript
// 重置后可以立即再次显示安装提示
this.$webToDesktop.resetDismissState();
this.$webToDesktop.showPromptManual();
```

#### `updateOptions(newOptions: object): void`

动态更新插件配置。

```javascript
this.$webToDesktop.updateOptions({
  themeColor: '#10b981',
  delay: 5000
});
```

#### `getOptions(): object`

获取当前配置选项。

```javascript
const options = this.$webToDesktop.getOptions();
console.log('当前主题色:', options.themeColor);
```

#### `getPlatformInfo(): object`

获取当前平台信息。

```javascript
const info = this.$webToDesktop.getPlatformInfo();
console.log(info);
// {
//   isIOS: false,
//   isIOSSafari: false,
//   isAndroid: false,
//   isMobile: false,
//   isMacOS: false,
//   isWindows: true,
//   isLinux: false,
//   supportsPWA: true,
//   isStandalone: false
// }
```

### 工具函数导出

除了插件本身，还导出了一些工具函数供高级用户使用：

```javascript
import { platform, storage, getI18nTexts, defaultI18n } from 'vue-web-to-desktop';

// platform - 平台检测工具
console.log('是否 iOS:', platform.isIOS());
console.log('是否支持 PWA:', platform.supportsPWA());
console.log('是否独立模式:', platform.isStandalone());

// storage - 存储管理
storage.setDismissed();                    // 设置已忽略
storage.isDismissed(7);                    // 检查是否在静默期内
storage.setInstalled();                    // 设置已安装
storage.isInstalled();                     // 检查是否已安装
storage.clear();                           // 清除所有存储

// getI18nTexts - 获取当前语言文案
const texts = getI18nTexts();
console.log(texts.title);                  // "安装桌面应用"

// defaultI18n - 默认国际化配置
console.log(defaultI18n['zh-CN'].title);   // "安装桌面应用"
```

---

## 🎨 自定义文案

### 完整覆盖

```javascript
app.use(WebToDesktop, {
  customI18n: {
    'zh-CN': {
      title: '安装 XXX 应用',
      description: '安装后可离线访问，体验更流畅',
      installButton: '一键安装',
      dismissButton: '下次再说',
      iosTitle: '添加到主屏幕',
      iosStep1: '点击底部的分享按钮 📤',
      iosStep2: '选择"添加到主屏幕"选项',
      iosStep3: '点击右上角"添加"按钮',
      installedTitle: '安装完成！',
      installedDescription: '现在可以从桌面启动应用了'
    },
    'en': {
      title: 'Install XXX App',
      description: 'Install for offline access and better experience',
      installButton: 'Install',
      dismissButton: 'Later',
      iosTitle: 'Add to Home Screen',
      iosStep1: 'Tap the Share button 📤',
      iosStep2: 'Select "Add to Home Screen"',
      iosStep3: 'Tap "Add" in the top right',
      installedTitle: 'Installed!',
      installedDescription: 'You can now launch the app from your home screen'
    }
  }
});
```

### 部分覆盖

只覆盖需要修改的字段：

```javascript
app.use(WebToDesktop, {
  customI18n: {
    'zh-CN': {
      title: '安装我们的应用',
      installButton: '立即体验'
    }
  }
});
```

### 支持的语言

| 语言代码 | 语言 |
|---------|------|
| `zh-CN` | 简体中文 |
| `zh-TW` | 繁体中文 |
| `en` | 英语 |
| `ja` | 日语 |
| `ko` | 韩语 |

---

## 🔧 高级用法

### 条件显示

使用 `onBeforeShow` 回调控制是否显示安装提示：

```javascript
app.use(WebToDesktop, {
  onBeforeShow: () => {
    // 只在用户已登录时显示
    const isLoggedIn = localStorage.getItem('token');
    return !!isLoggedIn;
  }
});
```

### 与 Vue Router 结合

```javascript
app.use(WebToDesktop, {
  onBeforeShow: () => {
    // 只在首页显示
    return router.currentRoute.value.path === '/';
  }
});
```

### 自定义安装按钮

```vue
<template>
  <div>
    <button 
      v-if="canInstall && !isInstalled" 
      @click="handleInstall"
      class="install-btn"
    >
      📥 安装应用
    </button>
    <span v-else-if="isInstalled" class="installed-badge">
      ✅ 已安装
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canInstall: false,
      isInstalled: false
    };
  },
  mounted() {
    this.canInstall = this.$webToDesktop.canInstall();
    this.isInstalled = this.$webToDesktop.isInstalled();
  },
  methods: {
    async handleInstall() {
      const result = await this.$webToDesktop.install();
      if (result) {
        this.isInstalled = true;
      }
    }
  }
};
</script>
```

### 监听安装状态变化

```javascript
app.use(WebToDesktop, {
  onInstalled: () => {
    // 发送统计
    analytics.track('pwa_installed');
    
    // 更新 UI
    store.commit('SET_PWA_INSTALLED', true);
    
    // 显示欢迎消息
    toast.success('应用安装成功！');
  }
});
```

### 调试模式

```javascript
app.use(WebToDesktop, {
  debug: true  // 在控制台输出详细日志
});
```

控制台输出示例：
```
[vue-web-to-desktop] 开始初始化...
[vue-web-to-desktop] Manifest 已注入
[vue-web-to-desktop] Service Worker 注册成功
[vue-web-to-desktop] 收到 beforeinstallprompt 事件
[vue-web-to-desktop] 安装提示已显示
```

---

## 🤔 工作原理

### 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                   vue-web-to-desktop                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   index.js  │  │  manifest.js │  │ service-worker.js │ │
│  │  Vue 插件   │  │ 动态 Manifest │  │     SW 注册       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│         │                │                    │              │
│         ▼                ▼                    ▼              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   utils.js  │  │   i18n.js   │  │  install-prompt.js  │ │
│  │ 平台检测/存储│  │   国际化    │  │      UI 组件        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                              │              │
│                                              ▼              │
│                                    ┌─────────────────────┐ │
│                                    │     styles.js       │ │
│                                    │      CSS 样式       │ │
│                                    └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 1. 动态 Manifest 逻辑

使用 `Blob` 和 `URL.createObjectURL` 动态创建 Manifest：

```javascript
// 生成 manifest 对象
const manifest = {
  name: document.title,
  short_name: document.title,
  icons: [{ src: getFavicon(), sizes: '192x192' }],
  display: 'standalone',
  // ...
};

// 创建 Blob URL
const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
const manifestUrl = URL.createObjectURL(blob);

// 注入到页面
const link = document.createElement('link');
link.rel = 'manifest';
link.href = manifestUrl;
document.head.appendChild(link);
```

**优点：**
- 无需静态 manifest.json 文件
- 可以根据当前页面动态生成
- 支持多站点共存

### 2. 独立运行模式 (Standalone)

应用安装后以 `standalone` 模式运行：

- **接口完全通畅** - 共享 Cookie/Token，无跨域问题
- **独立窗口** - 无浏览器地址栏，纯净的桌面客户端体验
- **保留登录状态** - 与网页版共享 Session

### 3. Service Worker

注册最小化的 Service Worker，仅用于满足 PWA 安装要求：

```javascript
// Network First 策略 - 不干扰原有请求
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
```

---

## 🌐 平台支持

| 平台 | 浏览器 | 安装方式 | 备注 |
|------|--------|----------|------|
| Windows | Chrome | ✅ 一键安装 | 推荐使用 |
| Windows | Edge | ✅ 一键安装 | 推荐使用 |
| Windows | Firefox | ❌ 不支持 | Firefox 不支持 PWA 安装 |
| macOS | Chrome | ✅ 一键安装 | 推荐使用 |
| macOS | Safari | ⚠️ 引导模式 | 需手动添加到 Dock |
| Linux | Chrome | ✅ 一键安装 | 推荐使用 |
| Android | Chrome | ✅ 一键安装 | 添加到主屏幕 |
| Android | Samsung Internet | ✅ 一键安装 | - |
| iOS | Safari | ⚠️ 引导模式 | 需手动添加到主屏幕 |
| iOS | Chrome | ❌ 有限支持 | iOS Chrome 限制 PWA 能力 |

### iOS Safari 特殊处理

由于 iOS Safari 不支持 `beforeinstallprompt` 事件，插件会自动切换为引导模式，显示步骤说明：

1. 点击底部的"分享"按钮
2. 选择"添加到主屏幕"
3. 点击"添加"完成安装

---

## ❓ 常见问题

### 1. 为什么安装提示没有显示？

**可能原因：**
- 浏览器不支持 PWA（如 Firefox）
- 用户之前点击过"暂不安装"，处于静默期内
- 应用已经安装
- 页面不是通过 HTTPS 访问的（开发环境的 localhost 除外）

**解决方案：**
```javascript
// 开启调试模式查看日志
app.use(WebToDesktop, { debug: true });

// 或手动重置状态
this.$webToDesktop.resetDismissState();
```

### 2. 如何在开发环境测试？

PWA 安装需要 HTTPS，但 `localhost` 是例外。确保在开发时使用：
- `http://localhost:xxxx`
- `http://127.0.0.1:xxxx`

### 3. 如何自定义安装图标？

```javascript
app.use(WebToDesktop, {
  manifestOptions: {
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  }
});
```

### 4. 与现有 Service Worker 冲突怎么办？

如果项目已有 Service Worker，插件会检测到并使用现有的，不会重复注册。

### 5. 如何强制再次显示安装提示？

```javascript
// 重置静默期
this.$webToDesktop.resetDismissState();
// 手动显示
this.$webToDesktop.showPromptManual();
```

### 6. 用户安装后如何检测？

```javascript
// 方式一：使用回调
app.use(WebToDesktop, {
  onInstalled: () => {
    console.log('已安装！');
  }
});

// 方式二：主动检测
if (this.$webToDesktop.isInstalled()) {
  console.log('应用已安装');
}

// 方式三：检测运行模式
const info = this.$webToDesktop.getPlatformInfo();
if (info.isStandalone) {
  console.log('正在 PWA 模式下运行');
}
```

---

## 📝 更新日志

### v1.0.0

- 🎉 首次发布
- ✅ 支持 Vue 2.x 和 Vue 3.x
- ✅ 动态 Manifest 生成
- ✅ 智能频控机制
- ✅ iOS Safari 引导模式
- ✅ 多语言支持（中/英/日/韩）
- ✅ 深色模式适配
- ✅ TypeScript 类型支持

---

## 📄 许可证

[MIT](LICENSE) © vue-web-to-desktop

---

## 🙏 贡献

欢迎提交 Issue 和 Pull Request！

### 开发

```bash
# 克隆仓库
git clone https://github.com/your-repo/vue-web-to-desktop.git

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

---

<p align="center">
  Made with ❤️ for the Vue community
</p>
