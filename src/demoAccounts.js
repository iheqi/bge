import { computed, ref, watch } from 'vue'
import { accountId } from './session'

// The demo ships four built-in accounts so a walkthrough can show how the console looks for a
// retail client, a corporation, an institution and someone who has not finished verification. Each
// one owns its own slice of mock data; nothing here is shared between accounts.
export const demoAccounts = [
  {
    id: '100002',
    kind: 'person',
    label: '个人账户',
    kyc: 'person',
    uid: '8395618828',
    email: 'heqi**gic@gmail.com',
    region: '中国香港',
    scale: 1,
  },
  {
    id: '100003',
    kind: 'corporation',
    label: '法团账户',
    kyc: 'corporation',
    uid: '8395619104',
    email: 'finance@harbour-trade.hk',
    region: '中国香港',
    scale: 26,
  },
  {
    id: '100004',
    kind: 'institution',
    label: '机构账户',
    kyc: 'institution',
    uid: '8395620477',
    email: 'ops@atlas-capital.com',
    region: '新加坡',
    scale: 180,
  },
  {
    id: '200001',
    kind: 'unverified',
    label: '未认证账户',
    kyc: null,
    uid: '8395623910',
    email: 'newuser**@gmail.com',
    region: '中国香港',
    scale: 0.2,
  },
]
export const defaultAccountId = demoAccounts[0].id

export const currentAccountId = computed(() => accountId.value ?? defaultAccountId)
export function accountOf(id) {
  return demoAccounts.find((item) => item.id === id) ?? demoAccounts[0]
}

// Per-account records are stored under a namespaced key. Writes only ever happen when someone
// edits something, never while a page is loading, so a browser with storage disabled still works.
export const accountStorageKey = (name) => `bge-demo:${currentAccountId.value}:${name}`
export function readAccountState(name, seed) {
  try {
    const saved = JSON.parse(localStorage.getItem(accountStorageKey(name)) || 'null')
    if (saved !== null) return saved
  } catch {
    /* Storage can be disabled by the browser. */
  }
  return seed
}
export function writeAccountState(name, value) {
  try {
    localStorage.setItem(accountStorageKey(name), JSON.stringify(value))
  } catch {
    /* Keep the session usable without persistent storage. */
  }
}
export function useAccountState(name, seed) {
  const state = ref(readAccountState(name, structuredClone(seed)))
  watch(state, (value) => writeAccountState(name, value), { deep: true })
  return state
}

// ---------------------------------------------------------------- mock data builders

// Same valuation table the asset page uses, kept in one place so every account agrees on it.
export const demoPrices = { USD: 1, HKD: 0.128, ETH: 3450, USDC: 1, USDT: 1, BTC: 96000, SOL: 150 }
const SPOT_PAIRS = ['BTC/USDT', 'ETH/USDT', 'BTC/USD', 'ETH/USD', 'SOL/USDT']
const PAIR_PRICE = {
  'BTC/USDT': 84100,
  'ETH/USDT': 4980,
  'BTC/USD': 84050,
  'ETH/USD': 4975,
  'SOL/USDT': 214,
}
// Each traded pair sets both the quote price and the base quantity the order is sized from.
const PAIR_BASE = {
  'BTC/USDT': ['BTC', 0.25],
  'ETH/USDT': ['ETH', 2],
  'BTC/USD': ['BTC', 0.25],
  'ETH/USD': ['ETH', 2],
  'SOL/USDT': ['SOL', 40],
}
const OTC_PRICE = {
  'ETH/USDC': 3320,
  'BTC/USDC': 81500,
  'ETH/HKD': 25860,
  'BTC/HKD': 634200,
  'USDT/HKD': 7.824,
  'USDC/USD': 1.0002,
}

// xorshift32. Seeded per account so a demo account shows the same records on every reload.
function makeRandom(seed) {
  let state = seed >>> 0 || 1
  return () => {
    state ^= state << 13
    state >>>= 0
    state ^= state >>> 17
    state ^= state << 5
    state >>>= 0
    return state / 4294967296
  }
}
const numericSeed = (id) => Number(id) || 1
const money = (value, digits = 2) =>
  value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
// Orders are stamped backwards from the demo "today" so the date filters have something to bite on.
const DEMO_TODAY = Date.UTC(2026, 9, 14, 9, 30, 0)
function stamp(hoursBack) {
  const date = new Date(DEMO_TODAY - hoursBack * 3600000)
  const pad = (value) => String(value).padStart(2, '0')
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
  )
}
function hexKey(random, length) {
  return Array.from({ length }, () => Math.floor(random() * 16).toString(16)).join('')
}
const SIZE = (pair) => [PAIR_BASE[pair][0], PAIR_BASE[pair][1]]

function buildSpot(random, scale) {
  const round = (base, spread) => base * (1 + (random() - 0.5) * spread)
  const current = []
  for (let index = 0; index < 2; index++) {
    const pair = SPOT_PAIRS[(index + 1) % SPOT_PAIRS.length]
    const [coin, base] = SIZE(pair)
    const quantity = base * scale * (0.4 + random())
    current.push([
      stamp(4 + index * 7),
      pair,
      index % 2 ? '市价单' : '限价单',
      index % 2 ? '卖出' : '买入',
      money(round(PAIR_PRICE[pair], 0.02)),
      `${quantity.toFixed(6)} ${coin}`,
      '未成交',
      '详情',
    ])
  }
  const history = []
  for (let index = 0; index < 4; index++) {
    const pair = SPOT_PAIRS[index % SPOT_PAIRS.length]
    const [coin, base] = SIZE(pair)
    const orderPrice = round(PAIR_PRICE[pair], 0.03)
    const filledPrice = orderPrice * (1 + (random() - 0.5) * 0.004)
    const quantity = base * scale * (0.5 + random())
    const quote = pair.split('/')[1]
    history.push([
      stamp(20 + index * 26),
      pair,
      index % 2 ? '市价单' : '限价单',
      index % 2 ? '卖出' : '买入',
      money(orderPrice),
      `${quantity.toFixed(6)} ${coin}`,
      money(filledPrice),
      `${quantity.toFixed(6)} ${coin}`,
      `${money(filledPrice * quantity)} ${quote}`,
      index === 3 ? '未成交' : '完全成交',
      '详情',
    ])
  }
  const deals = []
  for (let index = 0; index < 4; index++) {
    const pair = SPOT_PAIRS[(index + 2) % SPOT_PAIRS.length]
    const [coin, base] = SIZE(pair)
    const quote = pair.split('/')[1]
    const price = round(PAIR_PRICE[pair], 0.02)
    const quantity = base * scale * (0.3 + random())
    deals.push([
      stamp(9 + index * 15),
      pair,
      index % 2 ? '卖出' : '买入',
      money(price),
      `${quantity.toFixed(6)} ${coin}`,
      `${money(price * quantity)} ${quote}`,
      `${money(price * quantity * 0.001, 4)} ${quote}`,
      index % 2 ? '被动成交' : '主动成交',
    ])
  }
  return { current, history, deals }
}

function buildWallet(random, scale, bank) {
  const coins = ['BTC', 'ETH', 'USDT', 'USDC']
  const addresses = ['bc1q...9x2k', '0x9e37...7285', 'TXk8...q7fa', '0x41bd...c0e9']
  const digital = coins.map((symbol, index) => [
    stamp(30 + index * 22),
    symbol,
    (scale * (0.05 + random() * 0.4)).toFixed(8),
    addresses[index],
    index === 3 ? '处理中' : '已完成',
  ])
  const fiat = [
    [stamp(52), 'USD', money(12500 * scale), bank?.account ?? '—', '主要银行卡', '已完成', '查看'],
    [stamp(96), 'HKD', money(68000 * scale), bank?.account ?? '—', '主要银行卡', '处理中', '查看'],
  ]
  const transfer = [
    [stamp(12), 'USDT', money(3200 * scale), '资金账户', '交易账户', '已完成'],
    [stamp(70), 'ETH', (0.4 * scale).toFixed(8), '交易账户', '资金账户', '已完成'],
    [stamp(140), 'BTC', (0.02 * scale).toFixed(8), '资金账户', '交易账户', '已完成'],
  ]
  const quick = [
    [stamp(36), 'USDT', money(900 * scale), '资金账户', '交易账户', '已完成'],
    [stamp(128), 'HKD', money(8000 * scale), '交易账户', '资金账户', '已完成'],
  ]
  return { digital, fiat, transfer, quick }
}

function buildSettle() {
  return {
    daily: [
      ['2026年10月14日日结单', '下载'],
      ['2026年10月13日日结单', '下载'],
      ['2026年10月12日日结单', '下载'],
    ],
    monthly: [
      ['2026年09月结单', '下载'],
      ['2026年08月结单', '下载'],
    ],
  }
}

// 买卖意向单 and OTC 匹配单 — one row per client-side order and per matched pair, mirroring the
// operator console. A match order is never withdrawn, so 已取消 does not exist here.
function buildOtc(random, scale, pairs) {
  const contacts = ['客户端下单', '电邮联系', '电话联系']
  const intentStatuses = ['待匹配', '已匹配', '已完成', '已撤单']
  const intentOrders = []
  for (let index = 0; index < 8; index++) {
    const pair = pairs[index % pairs.length]
    const [base, quote] = pair.split('/')
    const buy = index % 2 === 0
    const status =
      intentStatuses[index % 4 === 3 ? 3 : index % 4 === 2 ? 2 : index % 4 === 1 ? 1 : 0]
    const quantity = (buy ? 1.5 : 1200) * scale * (0.5 + random())
    const digits = base === 'BTC' || base === 'ETH' ? 4 : 0
    const amount = `${money(quantity, digits)} ${base}`
    intentOrders.push({
      orderId: String(1209056642133905184n + BigInt(index) * 12345678n),
      pair,
      side: buy ? '买' : '卖',
      contact: contacts[index % contacts.length],
      getCoin: buy ? base : quote,
      payCoin: buy ? quote : base,
      amount,
      matched: status === '已匹配' || status === '已完成' ? amount : `0 ${base}`,
      createTime: stamp(6 + index * 30),
      status,
      price: money(OTC_PRICE[pair] ?? 1),
    })
  }
  const matchStatuses = ['待审核', '待复核', '已完成', '已拒绝']
  const matchOrders = []
  for (let index = 0; index < 6; index++) {
    const pair = pairs[(index + 1) % pairs.length]
    const [base, quote] = pair.split('/')
    const quantity = (index % 2 === 0 ? 1.2 : 900) * scale * (0.5 + random())
    matchOrders.push({
      orderNo: String(1209057511240028160n + BigInt(index) * 98765432n),
      role: index % 2 === 0 ? '买方' : '卖方',
      pair,
      buyCoin: base,
      payCoin: quote,
      price: `${money(OTC_PRICE[pair] ?? 1)} ${quote}`,
      qty: `${money(quantity, 4)} ${base}`,
      createTime: stamp(10 + index * 34),
      status: matchStatuses[index % matchStatuses.length],
    })
  }
  return { intentOrders, matchOrders }
}

// Devices and activity are kept as parts rather than finished sentences so the page can
// translate the region and the action instead of shipping a pre-baked string per account.
function buildSecurity(profile) {
  const browsers = [
    'OSX Chrome 154.0.0.0',
    'Windows Chrome 152.0.0.0',
    'iOS Safari 18.2',
    'OSX Safari 18.0',
  ]
  const ips = ['116.49.145.110', '203.198.44.7', '18.167.32.91', '202.64.18.6']
  const count = profile.kind === 'person' ? 2 : 3
  const devices = browsers.slice(0, count).map((browser, index) => ({
    browser,
    time: stamp(8 + index * 240),
    ip: ips[index % ips.length],
    region: profile.region,
  }))
  const actions = ['登录', '登录', '更改密码', '登录', '登录', '登录', '更改密码', '登录']
  const activity = Array.from({ length: 8 }, (_, index) => ({
    time: stamp(8 + index * 96),
    action: actions[index],
    browser: browsers[(index + 1) % browsers.length],
    ip: ips[(index + 2) % ips.length],
    region: profile.region,
  }))
  return { devices, activity }
}

// The API keys mirror the operator console list: the masked key, what it may do, whether an IP is
// bound, its state and the risk flags an operator would want to see next to it.
const API_KEY_SETS = {
  person: [
    {
      remarks: 'mobile-widget',
      authorities: ['readonly'],
      ipAddresses: '192.0.2.10',
      state: 'valid',
      createdDate: '2026-10-08 10:20:00',
      risk: [],
    },
    {
      remarks: 'tax-report',
      authorities: ['readonly'],
      ipAddresses: '',
      state: 'valid',
      createdDate: '2026-08-19 14:02:00',
      risk: ['apiRiskIdle'],
    },
  ],
  corporation: [
    {
      remarks: 'treasury-sync',
      authorities: ['readonly', 'trade'],
      ipAddresses: '198.51.100.20',
      state: 'valid',
      createdDate: '2026-09-02 09:30:00',
      risk: [],
    },
    {
      remarks: 'payroll-batch',
      authorities: ['readonly', 'trade'],
      ipAddresses: '198.51.100.21,198.51.100.22',
      state: 'valid',
      createdDate: '2026-07-15 11:45:00',
      risk: ['apiRiskMultiIp'],
    },
    {
      remarks: 'legacy-settle',
      authorities: ['readonly'],
      ipAddresses: '203.0.113.9',
      state: 'expired',
      createdDate: '2025-06-30 08:10:00',
      risk: ['apiRiskIdle'],
    },
  ],
  institution: [
    {
      remarks: 'grid-bot-prod',
      authorities: ['readonly', 'trade'],
      ipAddresses: '',
      state: 'valid',
      createdDate: '2026-10-01 09:12:00',
      risk: ['apiRiskUnboundTradeKey'],
    },
    {
      remarks: 'ledger-readonly',
      authorities: ['readonly'],
      ipAddresses: '203.0.113.14',
      state: 'valid',
      createdDate: '2026-09-18 17:40:00',
      risk: [],
    },
    {
      remarks: 'quant-test',
      authorities: ['readonly', 'trade'],
      ipAddresses: '',
      state: 'valid',
      createdDate: '2026-09-05 10:05:00',
      risk: ['apiRiskUnboundTradeKey', 'apiRiskMultiIp'],
    },
    {
      remarks: 'rebalance',
      authorities: ['readonly', 'trade', 'withdraw'],
      ipAddresses: '203.0.113.31',
      state: 'valid',
      createdDate: '2026-08-27 13:22:00',
      risk: ['apiRiskRateLimit'],
    },
    {
      remarks: 'old-script',
      authorities: ['readonly'],
      ipAddresses: '203.0.113.42',
      state: 'valid',
      createdDate: '2025-11-09 20:31:00',
      risk: ['apiRiskExpiring', 'apiRiskIdle'],
    },
    {
      remarks: 'hedge-bot',
      authorities: ['readonly', 'trade'],
      ipAddresses: '203.0.113.55',
      state: 'valid',
      createdDate: '2026-06-14 07:58:00',
      risk: ['apiRiskErrorRate'],
    },
    {
      remarks: 'report-56',
      authorities: ['readonly'],
      ipAddresses: '203.0.113.61',
      state: 'valid',
      createdDate: '2026-05-30 16:11:00',
      risk: [],
    },
    {
      remarks: 'dca-32',
      authorities: ['readonly', 'trade'],
      ipAddresses: '203.0.113.77',
      state: 'expired',
      createdDate: '2025-04-02 12:00:00',
      risk: ['apiRiskIdle'],
    },
    {
      remarks: 'dca-24',
      authorities: ['readonly'],
      ipAddresses: '203.0.113.88',
      state: 'revoked',
      createdDate: '2025-02-18 09:26:00',
      risk: [],
    },
  ],
}

function buildApiKeys(profile) {
  const list = API_KEY_SETS[profile.kind]
  if (!list) return []
  const random = makeRandom(numericSeed(profile.id) + 7)
  // The console masks the middle of the key, so the head and tail stay recognisable.
  return list.map((item, index) => ({
    ...item,
    id: `${profile.id}-key-${index + 1}`,
    apiKey: `dccb2137${hexKey(random, 20)}8fee`,
    secret: `demo_secret_${profile.id}_${index + 1}`,
  }))
}

const VERIFICATION = {
  person: { email: true, phone: false, ga: true, passwordUpdatedAt: '2026-08-18' },
  corporation: { email: true, phone: true, ga: true, passwordUpdatedAt: '2026-06-04' },
  institution: { email: true, phone: true, ga: true, passwordUpdatedAt: '2026-04-21' },
  unverified: { email: true, phone: false, ga: false, passwordUpdatedAt: '2026-10-11' },
}

export function buildAccount(profile) {
  const random = makeRandom(numericSeed(profile.id))
  const scale = profile.scale
  const pairPool =
    profile.kind === 'institution'
      ? ['ETH/USDC', 'BTC/USDC', 'USDT/HKD']
      : profile.kind === 'corporation'
        ? ['ETH/HKD', 'BTC/HKD', 'USDT/HKD']
        : ['ETH/USDC', 'BTC/USDC', 'USDC/USD']
  const unverified = profile.kind === 'unverified'
  // A client who has not finished verification has no card, no address and no API key yet.
  const bank = unverified
    ? null
    : {
        account: '**** 2861',
        name: profile.kind === 'person' ? 'HSBC Hong Kong' : 'Bank of China (Hong Kong)',
        branch: 'Central Branch',
        swift: 'HSBCHKHHHKH',
        tag: '主要银行卡',
        cards: [
          { code: 'USD', usage: 'both' },
          { code: 'HKD', usage: 'both' },
        ],
      }
  const wallet = unverified
    ? null
    : {
        address: '0x9e3729f5a1c237475d9f6a30ff6cf0f7138c7285',
        network: 'eth-',
        remark: '123',
        coin: 'ETH',
        status: '未认证',
        expires: '-',
      }
  const scaleOf = (base, factor) =>
    Object.fromEntries(
      Object.entries(base).map(([coin, value]) => [coin, Number((value * factor).toFixed(8))]),
    )
  // No verification means no business at all: no balances, no orders, no records. The pages that
  // would show them hand over to 身份认证 instead, so the empty shapes below are what a signed-in
  // but unverified visitor is allowed to see.
  const empty = unverified
    ? {
        balances: { fund: {}, trade: {} },
        spotOrders: { current: [], history: [], deals: [] },
        walletRecords: { digital: [], fiat: [], transfer: [], quick: [] },
        reports: { daily: [], monthly: [] },
        otc: { intentOrders: [], matchOrders: [] },
      }
    : null
  return {
    ...profile,
    balances: empty
      ? empty.balances
      : {
          fund: scaleOf(
            { USD: 12500, HKD: 68000, ETH: 2.4, USDC: 5600, USDT: 3200, BTC: 0.08, SOL: 0.02 },
            scale,
          ),
          trade: scaleOf(
            { USD: 3000, HKD: 5000, ETH: 0.35, USDC: 420, USDT: 180, BTC: 0.012, SOL: 0.01 },
            scale,
          ),
        },
    spotOrders: empty ? empty.spotOrders : buildSpot(random, Math.max(scale, 0.4)),
    walletRecords: empty ? empty.walletRecords : buildWallet(random, Math.max(scale, 0.4), bank),
    reports: empty ? empty.reports : buildSettle(),
    otc: empty ? empty.otc : buildOtc(random, Math.max(scale, 0.5), pairPool),
    security: buildSecurity(profile),
    payment: { bank, wallet },
    apiKeys: buildApiKeys(profile),
    verification: VERIFICATION[profile.kind],
  }
}

// Slices are built once and cached, so a transfer or a cancelled order stays put while the
// visitor moves around the site and only resets on a reload.
const cache = new Map()
export function accountData(id) {
  if (!cache.has(id)) cache.set(id, buildAccount(accountOf(id)))
  return cache.get(id)
}
export const currentAccount = computed(() => accountData(currentAccountId.value))
