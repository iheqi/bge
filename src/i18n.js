import { computed, watch } from 'vue'
import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import zhTW from './locales/zh-TW.json'
import en from './locales/en.json'
import sourceKeys from './locales/source-keys.json'
import elementZhCN from 'element-plus/es/locale/lang/zh-cn'
import elementZhTW from 'element-plus/es/locale/lang/zh-tw'
import elementEn from 'element-plus/es/locale/lang/en'

export const languages = [
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en', label: 'English' },
]
let savedLocale
try {
  savedLocale = localStorage.getItem('bge-locale')
} catch {
  /* Storage can be disabled by the browser. */
}

// Escape Vue I18n message syntax in literal business copy such as email addresses.
function prepare(messages) {
  return Object.fromEntries(
    Object.entries(messages).map(([key, value]) => [
      key,
      value.replace(/[@|]/g, (character) => "{'" + character + "'}"),
    ]),
  )
}
export const i18n = createI18n({
  legacy: false,
  locale: languages.some((item) => item.value === savedLocale) ? savedLocale : 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: { 'zh-CN': prepare(zhCN), 'zh-TW': prepare(zhTW), en: prepare(en) },
})

// Localize display values from existing tables without changing IDs, categories or saved data.
export function tr(value) {
  if (typeof value !== 'string') return value
  const key = sourceKeys[value.replace(/\s+/g, ' ').trim()]
  return key ? i18n.global.t(key) : value
}
export function formatCell(_row, _column, value) {
  return tr(value)
}
export function setLanguage(value) {
  if (languages.some((item) => item.value === value)) i18n.global.locale.value = value
}
export const elementLocale = computed(
  () =>
    ({
      'zh-CN': elementZhCN,
      'zh-TW': elementZhTW,
      en: elementEn,
    })[i18n.global.locale.value],
)

watch(
  i18n.global.locale,
  (value) => {
    document.documentElement.lang = value
    document.title = tr('BGE | 安全合规的数字资产交易')
    try {
      localStorage.setItem('bge-locale', value)
    } catch {
      /* Keep switching available. */
    }
  },
  { immediate: true },
)
