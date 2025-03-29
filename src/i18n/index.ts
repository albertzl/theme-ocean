import zhCN from './zh-CN';
import zhTW from './zh-TW';
import enUS from './en-US';
import koKR from './ko-KR';

// 定义消息类型
export type MessageItem = Record<string, any>;
export type Messages = Record<string, MessageItem>;

// 语言包
export const messages: Messages = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
  'ko-KR': koKR,
};

// 支持的语言
export const supportedLocales = ['zh-CN', 'zh-TW', 'en-US', 'ko-KR'];

// 语言名称映射
export const localeNames: Record<string, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English',
  'ko-KR': '한국어',
};

// 默认语言
export const defaultLocale = 'zh-CN';

// 获取当前浏览器语言
export function getBrowserLanguage(): string {
  const browserLang = navigator.language;
  
  // 检查完全匹配
  if (supportedLocales.includes(browserLang)) {
    return browserLang;
  }
  
  // 检查语言代码匹配（如 zh, en, ko 等）
  const langCode = browserLang.split('-')[0];
  const matchedLocale = supportedLocales.find(locale => locale.startsWith(langCode));
  
  if (matchedLocale) {
    return matchedLocale;
  }
  
  // 默认返回简体中文
  return defaultLocale;
}

// 当前使用的语言
let currentLocale = defaultLocale;

// 设置语言
export function setLocale(locale: string) {
  if (supportedLocales.includes(locale)) {
    currentLocale = locale;
    localStorage.setItem('locale', locale);
    document.documentElement.setAttribute('lang', locale);
    
    // 触发自定义事件，通知语言变更
    window.dispatchEvent(new CustomEvent('localeChanged', { detail: locale }));
    
    return true;
  }
  return false;
}

// 获取当前语言
export function getLocale(): string {
  return currentLocale;
}

// 初始化语言设置
export function initLocale() {
  // 优先使用用户已设置的语言
  const savedLocale = localStorage.getItem('locale');
  
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    currentLocale = savedLocale;
  } else {
    // 否则使用浏览器语言
    currentLocale = getBrowserLanguage();
  }
  
  // 设置 HTML lang 属性
  document.documentElement.setAttribute('lang', currentLocale);
  
  // 在初始化后触发一次语言变更事件，确保所有翻译都能应用
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('localeChanged', { detail: currentLocale }));
  }, 0);
  
  return currentLocale;
}

// 获取嵌套属性值的辅助函数
function getNestedValue(obj: Record<string, any>, keys: string[]): any {
  return keys.reduce((o, k) => (o && typeof o === 'object' && k in o ? o[k] : undefined), obj);
}

// 翻译函数
export function t(key: string, params: Record<string, any> = {}): string {
  const keys = key.split('.');
  
  // 尝试在当前语言中查找
  let value = getNestedValue(messages[currentLocale], keys);
  
  // 如果找不到，尝试在默认语言中查找
  if (value === undefined && currentLocale !== defaultLocale) {
    value = getNestedValue(messages[defaultLocale], keys);
  }
  
  // 如果是字符串，替换参数
  if (typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (_, paramName) => {
      return params[paramName] !== undefined ? String(params[paramName]) : `{${paramName}}`;
    });
  }
  
  // 如果找不到翻译，返回 key
  console.warn(`Translation not found for key: ${key}`);
  return key;
} 