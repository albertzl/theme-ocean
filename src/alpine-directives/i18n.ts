import Alpine from 'alpinejs';
import { t } from '../i18n';

export default function installI18nDirective() {
  // 注册 x-i18n 指令，将元素文本内容替换为翻译
  Alpine.directive('i18n', (el, { expression }) => {
    if (!expression) return;
    
    // 初始化时翻译
    el.textContent = t(expression);
    
    // 监听语言变更事件，更新翻译
    const updateTranslation = () => {
      el.textContent = t(expression);
    };
    
    // 添加监听器并在元素移除时清理
    window.addEventListener('localeChanged', updateTranslation);
    Alpine.onAttributeRemoved(el, 'x-i18n', () => {
      window.removeEventListener('localeChanged', updateTranslation);
    });
  });
  
  // 注册 x-i18n-params 指令，处理带参数的翻译
  Alpine.directive('i18n-params', (el, { expression, modifiers }, { evaluateLater, effect }) => {
    if (!expression || modifiers.length === 0) return;
    
    const key = modifiers[0];
    const getParams = evaluateLater(expression);
    
    effect(() => {
      getParams((rawParams: unknown) => {
        // 确保 params 是对象类型
        const params = typeof rawParams === 'object' && rawParams !== null 
          ? rawParams as Record<string, any> 
          : {};
        el.textContent = t(key, params);
      });
    });
    
    // 监听语言变更事件，更新翻译
    const updateTranslation = () => {
      getParams((rawParams: unknown) => {
        // 确保 params 是对象类型
        const params = typeof rawParams === 'object' && rawParams !== null 
          ? rawParams as Record<string, any> 
          : {};
        el.textContent = t(key, params);
      });
    };
    
    window.addEventListener('localeChanged', updateTranslation);
    Alpine.onAttributeRemoved(el, 'x-i18n-params', () => {
      window.removeEventListener('localeChanged', updateTranslation);
    });
  });
  
  // 注册全局方法，在 Alpine 表达式中使用
  Alpine.magic('t', () => {
    return (key: string, params = {}) => t(key, params);
  });
  
  // 处理动态添加的元素
  // 确保页面中所有的 data-i18n 属性元素都能正确显示翻译内容
  window.addEventListener('DOMContentLoaded', () => {
    processAllI18nElements();
  });
  
  window.addEventListener('localeChanged', () => {
    processAllI18nElements();
  });
}

// 处理所有带有 data-i18n 属性的元素
function processAllI18nElements() {
  // 查找所有带有x-i18n属性的元素
  document.querySelectorAll('[x-i18n]').forEach(el => {
    const key = el.getAttribute('x-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });
  
  // 处理带参数的翻译
  document.querySelectorAll('[x-i18n-params]').forEach(el => {
    const attrName = Array.from(el.attributes)
      .find(attr => attr.name.startsWith('x-i18n-params:'))?.name;
    
    if (attrName) {
      const key = attrName.split(':')[1];
      // 这里处理有局限性，对于复杂的params对象无法完全支持
      // 考虑使用data属性存储简单参数
      const paramStr = el.getAttribute(attrName);
      try {
        const params = paramStr ? JSON.parse(paramStr.replace(/'/g, '"')) : {};
        el.textContent = t(key, params);
      } catch (e) {
        console.error('Failed to parse i18n params:', e);
        el.textContent = t(key);
      }
    }
  });
} 