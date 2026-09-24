import { createRequire } from 'node:module'
import fs from 'node:fs'
const require = createRequire(process.cwd() + '/package.json')
const { createServer } = await import(require.resolve('vite'))
const { createSSRApp, nextTick } = await import(require.resolve('vue'))
const { renderToString } = await import(require.resolve('@vue/server-renderer'))
const ep = await import(require.resolve('element-plus'))
const ElementPlus = ep.default
const storage = new Map()
globalThis.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, v),
}
globalThis.document = { documentElement: { lang: '' }, title: '' }
globalThis.window = { location: { pathname: '/bge/hk/zh-CN/user/dashboard', search: '' } }
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})
try {
  const { i18n, tr, setLanguage } = await server.ssrLoadModule('/src/i18n.js')
  const errors = []
  const catalogues = ['zh-CN', 'zh-TW', 'en'].map((locale) =>
    JSON.parse(fs.readFileSync('src/locales/' + locale + '.json', 'utf8')),
  )
  const keys = Object.keys(catalogues[0])
  for (const catalogue of catalogues) {
    if (
      Object.keys(catalogue).length !== keys.length ||
      keys.some((key) => typeof catalogue[key] !== 'string' || !catalogue[key].trim())
    )
      throw Error('Language packs have missing keys')
  }
  const { messages } = await server.ssrLoadModule('/src/messages.js')
  const originalMessages = JSON.stringify(messages.value)
  let renderCount = 0
  for (const locale of ['zh-CN', 'zh-TW', 'en']) {
    setLanguage(locale)
    await nextTick()
    if (document.documentElement.lang !== locale || storage.get('bge-locale') !== locale)
      throw Error('Language persistence or document language failed')
    for (const key of keys)
      if (i18n.global.t(key, { count: 3 }) === key) errors.push(locale + ': missing ' + key)
    if (locale === 'en' && tr('资金账户') !== 'Funding Account')
      errors.push('Dynamic translation failed')
    if (tr('BTC/USDT') !== 'BTC/USDT') errors.push('Trading symbols must not change')
    for (const [file, props, path, search] of [
      ...[
        'Home',
        'Otc',
        'Company',
        'UserCenter',
        'Kyc',
        'Report',
        'AccountSecurity',
        'ApiPage',
        'Payment',
        'Market',
        'MessageCenter',
        'Parameters',
        'ParameterContent',
        'MessageBell',
      ].map((file) => [file, {}, '/bge/hk/zh-CN/user/dashboard', '']),
      ['Company', { security: true }, '/bge/hk/zh-CN/security', ''],
      ['UserCenter', { assets: true }, '/bge/hk/zh-CN/user/assets', '?account=fund'],
      ['UserCenter', { assets: true }, '/bge/hk/zh-CN/user/assets', '?account=trade'],
      ['Payment', {}, '/bge/hk/zh-CN/user/payment/crypto', ''],
      ...['wallet', 'otc-orders', 'settle'].map((path) => [
        'Report',
        {},
        '/bge/hk/zh-CN/user/report/' + path,
        '',
      ]),
    ]) {
      window.location = { pathname: path, search }
      const component = (await server.ssrLoadModule('/src/' + file + '.vue')).default
      const app = createSSRApp(component, props)
      app.use(i18n).use(ElementPlus)
      app.provide(ep.ID_INJECTION_KEY, { prefix: 1024, current: 0 })
      app.provide(ep.ZINDEX_INJECTION_KEY, { current: 0 })
      app.config.warnHandler = (message) => {
        if (/Failed to resolve|not defined|Invalid/.test(message))
          errors.push(file + ': ' + message)
      }
      const html = await renderToString(app)
      renderCount++
      if (/text\d{3}/.test(html)) errors.push(file + ' leaked message keys')
      if (locale === 'en') {
        const visible = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
        const residual = visible.replace('繁體中文', '').replace('简体中文', '')
        const found = residual.match(/[\p{Script=Han}]+/gu)
        if (found) errors.push(file + ': untranslated ' + found.join(', '))
      }
    }
  }
  if (JSON.stringify(messages.value) !== originalMessages)
    errors.push('Language switch mutated message data')
  if (errors.length) throw Error(errors.join('\n'))
  console.log(
    renderCount +
      ' page/component renders passed; language packs, persistence and data integrity verified',
  )
} finally {
  await server.close()
}
