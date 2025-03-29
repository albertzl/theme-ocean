## 开发

```bash
git clone git@github.com:f2ccloud/theme-ocean.git ~/halo2-dev/themes/theme-ocean-albert
```

```bash
cd ~/halo2-dev/themes/theme-ocean-albert
```

```bash
pnpm install 
```

```bash
pnpm dev
```

主题开发文档可查阅：<https://docs.halo.run/developer-guide/theme/prepare>

## 构建

> 如果你使用的是 Windows 操作系统，请安装 `make` 命令并在 Git Bash 或 WSL 中执行。

```bash
make build
```

然后将 `dist` 目录压缩成 `ZIP` 格式压缩包即可在 Halo 后台上传安装。

## 多语言支持

本主题支持多语言功能，目前支持简体中文、繁体中文、英文和韩文。添加和修改多语言相关内容时，请遵循以下开发规则：

### 语言文件

语言文件位于 `src/i18n` 目录下，每个语言文件对应一种语言:

- `zh-CN.ts`: 简体中文
- `zh-TW.ts`: 繁体中文
- `en-US.ts`: 英文
- `ko-KR.ts`: 韩文

当添加新的文本内容时，需要同时更新所有语言文件。

### 在模板中使用

在 HTML 模板中使用多语言有以下几种方式：

1. 使用 `x-i18n` 指令
   ```html
   <span x-i18n="common.search"></span>
   ```

2. 使用带参数的翻译
   ```html
   <span x-i18n-params:common.readTime="{ count: textLength, time: minutes }"></span>
   ```

3. 在 Alpine.js 表达式中使用
   ```html
   <div :title="$t('nav.theme', {current: colorScheme.label, next: nextColorScheme.label})"></div>
   ```

### 添加新语言

如需添加新语言支持，请按照以下步骤操作：

1. 在 `src/i18n` 目录下创建新的语言文件，例如 `fr-FR.ts`
2. 在 `src/i18n/index.ts` 文件中导入并注册新语言：
   ```typescript
   import frFR from './fr-FR';
   
   export const messages = {
     'zh-CN': zhCN,
     'zh-TW': zhTW,
     'en-US': enUS,
     'ko-KR': koKR,
     'fr-FR': frFR,  // 添加新语言
   };
   
   export const supportedLocales = ['zh-CN', 'zh-TW', 'en-US', 'ko-KR', 'fr-FR'];
   
   export const localeNames = {
     'zh-CN': '简体中文',
     'zh-TW': '繁體中文',
     'en-US': 'English',
     'ko-KR': '한국어',
     'fr-FR': 'Français',  // 添加新语言名称
   };
   ```
