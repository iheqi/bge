import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import ElementPlus, { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
const storage = new Map([['bge-currency', 'HKD']])
globalThis.localStorage = {
  getItem: (key) => storage.get(key),
  setItem: (key, value) => storage.set(key, value),
}
globalThis.document = { documentElement: {}, title: '' }
globalThis.window = { location: { pathname: '/bge/hk/zh-CN/user/assets', search: '' } }
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})
try {
  const { currency, setCurrency, convertCurrency, formatMoney, formatFiatText } =
    await server.ssrLoadModule('/src/currency.js')
  const { i18n } = await server.ssrLoadModule('/src/i18n.js')
  assert.equal(currency.value, 'HKD')
  assert.equal(convertCurrency(100), 780)
  assert.equal(convertCurrency(780, 'HKD', 'USD'), 100)
  assert.equal(formatMoney(null), '--')
  assert.equal(formatMoney(NaN), '--')
  assert.equal(formatMoney(0), 'HKD 0.00')
  assert.equal(formatFiatText('BTC/USDT'), 'BTC/USDT')
  assert.equal(formatFiatText('500,000 HKD'), 'HKD 500,000.00')
  setCurrency('CNY')
  assert.equal(currency.value, 'HKD')
  for (const value of ['USD', 'HKD', 'USD']) {
    setCurrency(value)
    assert.equal(storage.get('bge-currency'), value)
    assert.equal(formatMoney(100), value === 'USD' ? 'USD 100.00' : 'HKD 780.00')
    for (const file of ['Market', 'UserCenter', 'ParameterContent', 'CurrencySwitcher']) {
      const { default: component } = await server.ssrLoadModule(`/src/${file}.vue`)
      const html = await renderToString(
        createSSRApp(component, file === 'UserCenter' ? { assets: true } : {})
          .use(i18n)
          .use(ElementPlus)
          .provide(ID_INJECTION_KEY, { prefix: 1, current: 0 })
          .provide(ZINDEX_INJECTION_KEY, { current: 0 }),
      )
      assert.ok(html.includes(value), `${file}: currency missing`)
      if (file === 'Market') {
        assert.ok(html.includes(formatMoney(84106.642, 'USD', 6)))
        assert.ok(!html.includes('¥'))
      }
      if (file === 'UserCenter') assert.ok(html.includes(formatMoney(0, 'USD', 4)))
    }
  }
  globalThis.localStorage.setItem = () => {
    throw Error('Storage disabled')
  }
  setCurrency('HKD')
  assert.equal(currency.value, 'HKD')
  console.log('Currency conversion, persistence, quote units and 12 page renders passed')
} finally {
  await server.close()
}
