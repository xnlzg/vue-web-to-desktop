/**
 * 国际化配置
 * 支持中文、英文、日文、韩文
 */
export const defaultI18n = {
  'zh-CN': {
    title: '安装桌面应用',
    description: '将此网站安装为桌面应用，享受更快捷的访问体验',
    installButton: '立即安装',
    dismissButton: '暂不安装',
    installing: '正在安装桌面程序',
    installingDescription: '请在浏览器弹窗中点击"安装"确认',
    iosTitle: '添加到主屏幕',
    iosStep1: '点击底部的 "分享" 按钮',
    iosStep2: '选择 "添加到主屏幕"',
    iosStep3: '点击 "添加" 完成安装',
    installedTitle: '安装成功',
    installedDescription: '可从桌面启动应用了'
  },
  'zh-TW': {
    title: '安裝桌面應用',
    description: '將此網站安裝為桌面應用，享受更快捷的訪問體驗',
    installButton: '立即安裝',
    dismissButton: '暫不安裝',
    installing: '正在安裝桌面程式',
    installingDescription: '請在瀏覽器彈窗中點擊「安裝」確認',
    iosTitle: '添加到主螢幕',
    iosStep1: '點擊底部的 "分享" 按鈕',
    iosStep2: '選擇 "添加到主螢幕"',
    iosStep3: '點擊 "添加" 完成安裝',
    installedTitle: '安裝成功',
    installedDescription: '可從桌面啟動應用了'
  },
  'en': {
    title: 'Install Desktop App',
    description: 'Install this website as a desktop app for a faster experience',
    installButton: 'Install Now',
    dismissButton: 'Not Now',
    installing: 'Installing Desktop App',
    installingDescription: 'Please click "Install" in the browser popup',
    iosTitle: 'Add to Home Screen',
    iosStep1: 'Tap the "Share" button at the bottom',
    iosStep2: 'Select "Add to Home Screen"',
    iosStep3: 'Tap "Add" to complete installation',
    installedTitle: 'Installation Complete',
    installedDescription: 'You can now launch it from your desktop'
  },
  'ja': {
    title: 'デスクトップアプリをインストール',
    description: 'このウェブサイトをデスクトップアプリとしてインストールして、より快適にアクセスできます',
    installButton: '今すぐインストール',
    dismissButton: '後で',
    installing: 'デスクトップアプリをインストール中',
    installingDescription: 'ブラウザのポップアップで「インストール」をクリックしてください',
    iosTitle: 'ホーム画面に追加',
    iosStep1: '下部の「共有」ボタンをタップ',
    iosStep2: '「ホーム画面に追加」を選択',
    iosStep3: '「追加」をタップしてインストール完了',
    installedTitle: 'インストール完了',
    installedDescription: 'デスクトップから起動できます'
  },
  'ko': {
    title: '데스크톱 앱 설치',
    description: '이 웹사이트를 데스크톱 앱으로 설치하여 더 빠르게 접근하세요',
    installButton: '지금 설치',
    dismissButton: '나중에',
    installing: '데스크톱 앱 설치 중',
    installingDescription: '브라우저 팝업에서 "설치"를 클릭하세요',
    iosTitle: '홈 화면에 추가',
    iosStep1: '하단의 "공유" 버튼을 탭하세요',
    iosStep2: '"홈 화면에 추가"를 선택하세요',
    iosStep3: '"추가"를 탭하여 설치 완료',
    installedTitle: '설치 완료',
    installedDescription: '데스크톱에서 시작할 수 있습니다'
  }
};

/**
 * 获取当前浏览器语言对应的文案
 * @param {Object} customI18n 自定义文案
 * @returns {Object} 当前语言的文案
 */
export function getI18nTexts(customI18n) {
  const mergedI18n = { ...defaultI18n };

  // 合并自定义文案（确保 customI18n 是对象）
  if (customI18n && typeof customI18n === 'object') {
    Object.keys(customI18n).forEach(lang => {
      mergedI18n[lang] = { ...mergedI18n[lang], ...customI18n[lang] };
    });
  }

  // 获取浏览器语言
  const browserLang = navigator.language || navigator.userLanguage || 'en';

  // 精确匹配
  if (mergedI18n[browserLang]) {
    return mergedI18n[browserLang];
  }

  // 模糊匹配 (如 zh -> zh-CN)
  const baseLang = browserLang.split('-')[0];
  const matchedLang = Object.keys(mergedI18n).find(lang => lang.startsWith(baseLang));

  if (matchedLang) {
    return mergedI18n[matchedLang];
  }

  // 默认英文
  return mergedI18n['en'];
}
