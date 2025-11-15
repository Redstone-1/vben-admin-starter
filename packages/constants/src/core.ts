export const VBEN_DOC_URL = 'https://vbenjs.github.io/vue-vben-admin/';
export const VBEN_GITHUB_URL = 'https://github.com/vbenjs/vue-vben-admin';

/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/auth/login';

export interface LanguageOption {
  label: string;
  value: 'en-US' | 'zh-CN';
}

/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English',
    value: 'en-US',
  },
];
