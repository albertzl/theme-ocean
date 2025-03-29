import { getLocale, setLocale, supportedLocales, localeNames } from '../i18n';

interface I18nSwitcherData {
  currentLocale: string;
  locales: string[];
  localeNames: Record<string, string>;
  switchLocale: (locale: string) => void;
  isActive: (locale: string) => boolean;
}

export default function i18nSwitcher(): I18nSwitcherData {
  return {
    currentLocale: getLocale(),
    locales: supportedLocales,
    localeNames,
    switchLocale(locale: string) {
      if (setLocale(locale)) {
        this.currentLocale = locale;
        
        // 重新加载页面以应用新语言
        // 可以选择不重新加载，但可能需要重新渲染所有翻译
        window.location.reload();
      }
    },
    isActive(locale: string) {
      return this.currentLocale === locale;
    }
  };
} 