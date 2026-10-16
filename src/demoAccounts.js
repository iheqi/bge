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

// A fee tier, a risk rating and an account limit travel together, so the fee centre, the two
// panels on the asset page and the spot fees all read the same plan. 个人 sits in the lowest tier
// and is over its position limit, which is what the 超出 state on the asset page is for.
const ACCOUNT_PLANS = {
  person: {
    level: 1,
    makerDiscount: 0,
    takerDiscount: 0,
    spotVolume: '2.40',
    assetVolume: '0.09',
    riskLevel: 3,
    riskKey: 'riskMidHigh',
    riskDate: '2026-08-18',
    // The limit is a multiple of what the account actually holds: 个人 sits just under it, which is
    // what the 超出 state on the asset page is there to show.
    limitFactor: 0.9,
  },
  corporation: {
    level: 3,
    makerDiscount: 20,
    takerDiscount: 10,
    spotVolume: '62.40',
    assetVolume: '2.34',
    riskLevel: 4,
    riskKey: 'riskHigh',
    riskDate: '2026-06-04',
    limitFactor: 1.15,
  },
  institution: {
    level: 5,
    makerDiscount: 40,
    takerDiscount: 25,
    spotVolume: '432.00',
    assetVolume: '16.20',
    riskLevel: 5,
    riskKey: 'assetRiskLevel',
    riskDate: '2026-04-21',
    limitFactor: 1.25,
  },
  unverified: {
    level: 0,
    makerDiscount: 0,
    takerDiscount: 0,
    spotVolume: '0.00',
    assetVolume: '0.00',
    riskLevel: 0,
    riskKey: 'riskNone',
    riskDate: '—',
    limitFactor: 0,
  },
}
// The published spot rates. A tier discount comes off these, so 我的费率 moves with the level.
const BASE_FEE = { maker: 0.2, taker: 0.25 }
const feeOf = (plan, side) => {
  const rate =
    (side === 'maker' ? BASE_FEE.maker : BASE_FEE.taker) * (1 - plan[`${side}Discount`] / 100)
  return Number(rate.toFixed(4))
}
// HKD per BTC, so the position limit can be compared with the balances below.
const HKD_PER_BTC = demoPrices.BTC / demoPrices.HKD

// A payment reference the way a bank would print it: the day it was raised plus a running number.
const paymentSerial = (id, index) =>
  `PS20261014${String((numericSeed(id) + index * 977) % 100000).padStart(5, '0')}`

// A pending spot order keeps the same id wherever it is named, so the order detail page and the
// frozen-balance tooltip point at the same record.
export function spotOrderId(id, tab, index) {
  const base = tab === 'current' ? 1209057511240028160n : 1209056642133905184n
  return String(base + BigInt(numericSeed(id)) * 7919n + BigInt(index) * 12345678n)
}

// Spot orders are sized against the trade account balance, so a resting order never asks for more
// than the account holds and the frozen amount derived from it stays under the balance.
function buildSpot(random, profile, plan, trade) {
  const round = (base, spread) => base * (1 + (random() - 0.5) * spread)
  // Rows 0 and 2 rest on the same pair and side, so 交易账户 has two orders freezing one coin.
  const pairAt = (index) => SPOT_PAIRS[index === 2 ? 1 : (index + 1) % SPOT_PAIRS.length]
  const current = []
  const currentDetail = []
  for (let index = 0; index < 3; index++) {
    const pair = pairAt(index)
    const coin = pair.split('/')[0]
    const quote = pair.split('/')[1]
    const side = index === 1 ? '卖出' : '买入'
    const type = index === 1 ? '市价单' : '限价单'
    const price = Number(round(PAIR_PRICE[pair], 0.02).toFixed(2))
    const held = (side === '买入' ? trade[quote] : trade[coin]) ?? 0
    const quantity = Number(
      (side === '买入'
        ? (held * (0.18 + random() * 0.14)) / price
        : held * (0.18 + random() * 0.14)
      ).toFixed(6),
    )
    const notional = Number((price * quantity).toFixed(2))
    const detail = {
      orderId: spotOrderId(profile.id, 'current', index),
      pair,
      coin,
      quote,
      type,
      side,
      price,
      quantity,
      notional,
      filled: 0,
      cancelled: 0,
      stp: '不启用',
      source: 'Web 交易页',
      uid: profile.uid,
      fee: Number(
        ((notional * feeOf(plan, type === '市价单' ? 'taker' : 'maker')) / 100).toFixed(6),
      ),
      feeCoin: quote,
      status: '未成交',
      createTime: stamp(4 + index * 7),
    }
    currentDetail.push(detail)
    current.push([
      detail.createTime,
      pair,
      type,
      side,
      money(price),
      `${quantity.toFixed(6)} ${coin}`,
      detail.status,
      '详情',
    ])
  }
  const history = []
  const historyDetail = []
  for (let index = 0; index < 4; index++) {
    const pair = SPOT_PAIRS[index % SPOT_PAIRS.length]
    const coin = pair.split('/')[0]
    const quote = pair.split('/')[1]
    const side = index % 2 ? '卖出' : '买入'
    const type = index % 2 ? '市价单' : '限价单'
    const price = Number(round(PAIR_PRICE[pair], 0.03).toFixed(2))
    const filledPrice = Number((price * (1 + (random() - 0.5) * 0.004)).toFixed(2))
    const held = (side === '买入' ? trade[quote] : trade[coin]) ?? 0
    const quantity = Number(
      (side === '买入'
        ? (held * (0.2 + random() * 0.2)) / price
        : held * (0.2 + random() * 0.2)
      ).toFixed(6),
    )
    const status = index === 3 ? '已撤单' : '完全成交'
    const filled = status === '完全成交' ? quantity : Number((quantity * 0.35).toFixed(6))
    const cancelled = status === '已撤单' ? Number((quantity - filled).toFixed(6)) : 0
    const detail = {
      orderId: spotOrderId(profile.id, 'history', index),
      pair,
      coin,
      quote,
      type,
      side,
      price,
      quantity,
      notional: Number((price * quantity).toFixed(2)),
      avgPrice: filledPrice,
      filled,
      cancelled,
      stp: '不启用',
      source: index % 2 ? 'API' : 'Web 交易页',
      uid: profile.uid,
      fee: Number(
        ((filledPrice * filled * feeOf(plan, type === '市价单' ? 'taker' : 'maker')) / 100).toFixed(
          6,
        ),
      ),
      feeCoin: quote,
      amount: Number((filledPrice * filled).toFixed(2)),
      status,
      createTime: stamp(20 + index * 26),
    }
    historyDetail.push(detail)
    history.push([
      detail.createTime,
      pair,
      type,
      side,
      money(price),
      `${quantity.toFixed(6)} ${coin}`,
      money(filledPrice),
      `${filled.toFixed(6)} ${coin}`,
      `${money(detail.amount)} ${quote}`,
      status,
      '详情',
    ])
  }
  const deals = []
  for (let index = 0; index < 4; index++) {
    const pair = SPOT_PAIRS[(index + 2) % SPOT_PAIRS.length]
    const coin = pair.split('/')[0]
    const quote = pair.split('/')[1]
    const price = round(PAIR_PRICE[pair], 0.02)
    const quantity = ((trade[coin] ?? 0) * (0.15 + random() * 0.2)).toFixed(6)
    deals.push([
      stamp(9 + index * 15),
      pair,
      index % 2 ? '卖出' : '买入',
      money(price),
      `${quantity} ${coin}`,
      `${money(price * quantity)} ${quote}`,
      `${money(price * quantity * 0.001, 4)} ${quote}`,
      index % 2 ? '被动成交' : '主动成交',
    ])
  }
  return { current, history, deals, currentDetail, historyDetail }
}

function buildWallet(random, profile, scale, bank) {
  const coins = ['BTC', 'ETH', 'USDT', 'USDC']
  const networks = { BTC: 'Bitcoin', ETH: 'ERC20', USDT: 'TRC20', USDC: 'ERC20' }
  const addresses = ['bc1q...9x2k', '0x9e37...7285', 'TXk8...q7fa', '0x41bd...c0e9']
  // The first coin of each pair came in, the second went out, so the detail page has both
  // directions to fork on.
  const digital = []
  const digitalDetail = []
  coins.forEach((symbol, index) => {
    const deposit = index < 2
    const status = index === 3 ? '处理中' : '已完成'
    const quantity = Number((scale * (0.05 + random() * 0.4)).toFixed(8))
    const fee = deposit ? 0 : Number((quantity * 0.002).toFixed(8))
    const detail = {
      direction: deposit ? '存款' : '取款',
      no: String(
        1209056642998171648n + BigInt(numericSeed(profile.id)) * 131n + BigInt(index) * 7717n,
      ),
      uid: profile.uid,
      coin: symbol,
      network: networks[symbol],
      quantity,
      fee,
      received: Number((quantity - fee).toFixed(8)),
      txid: deposit ? `0x${hexKey(random, 56)}` : '—',
      address: addresses[index],
      addressVerified: index === 0 ? '已认证' : index === 3 ? '未认证' : '已认证',
      confirmations: status === '处理中' ? 3 : 19 + index * 7,
      bank: bank?.name ?? '—',
      bankAccount: bank?.account ?? '—',
      companyBank: 'Bank of China (Hong Kong)',
      companyAccount: '012-875-12345678',
      serial: deposit ? paymentSerial(profile.id, index) : '—',
      risk: deposit ? (index === 0 ? '低风险' : '关注') : '—',
      createTime: stamp(30 + index * 22),
      status,
    }
    digitalDetail.push(detail)
    digital.push([
      detail.createTime,
      detail.direction,
      symbol,
      quantity.toFixed(8),
      addresses[index],
      status,
      '详情',
    ])
  })
  const fiat = []
  const fiatDetail = []
  const fiatRows = [
    { direction: '存款', coin: 'USD', amount: 12500 * scale, status: '已完成', hours: 52 },
    { direction: '取款', coin: 'HKD', amount: 68000 * scale, status: '处理中', hours: 96 },
  ]
  fiatRows.forEach((row, index) => {
    const fee = row.direction === '存款' ? 0 : Number((row.amount * 0.001).toFixed(2))
    const detail = {
      direction: row.direction,
      no: String(
        1209057511333904384n + BigInt(numericSeed(profile.id)) * 233n + BigInt(index) * 991n,
      ),
      uid: profile.uid,
      coin: row.coin,
      amount: row.amount,
      fee,
      received: Number((row.amount - fee).toFixed(2)),
      bank: bank?.name ?? '—',
      bankAccount: bank?.account ?? '—',
      companyBank: 'Bank of China (Hong Kong)',
      companyAccount: '012-875-12345678',
      serial: row.direction === '存款' ? paymentSerial(profile.id, index + 8) : '—',
      risk: row.direction === '存款' ? (index === 0 ? '低风险' : '关注') : '—',
      createTime: stamp(row.hours),
      status: row.status,
      tag: '主要银行卡',
    }
    fiatDetail.push(detail)
    fiat.push([
      detail.createTime,
      detail.direction,
      row.coin,
      money(row.amount),
      bank?.account ?? '—',
      '主要银行卡',
      row.status,
      '详情',
    ])
  })
  const transfer = [
    [stamp(12), 'USDT', money(3200 * scale), '资金账户', '交易账户', '已完成'],
    [stamp(70), 'ETH', (0.4 * scale).toFixed(8), '交易账户', '资金账户', '已完成'],
    [stamp(140), 'BTC', (0.02 * scale).toFixed(8), '资金账户', '交易账户', '已完成'],
  ]
  const quick = [
    [stamp(36), 'USDT', money(900 * scale), '资金账户', '交易账户', '已完成'],
    [stamp(128), 'HKD', money(8000 * scale), '交易账户', '资金账户', '已完成'],
  ]
  return { digital, fiat, transfer, quick, digitalDetail, fiatDetail }
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
function buildOtc(random, scale, pairs, id) {
  const contacts = ['客户端下单', '电邮联系', '电话联系']
  // 待匹配 / 已匹配 are the live states: only those still freeze the currency they pay with, and
  // the sell intents are what 资金账户 reports as frozen.
  const intentStatuses = [
    '待匹配',
    '已匹配',
    '已撤单',
    '已匹配',
    '已完成',
    '待匹配',
    '已撤单',
    '已完成',
  ]
  // A realistic size per base coin, so a sell intent never claims to sell 1200 BTC.
  const intentSizes = { BTC: 0.05, ETH: 1.2, USDC: 600, USDT: 800 }
  const intentOrders = []
  for (let index = 0; index < 8; index++) {
    const pair = pairs[index % pairs.length]
    const [base, quote] = pair.split('/')
    const buy = index % 2 === 0
    const status = intentStatuses[index]
    const quantity = (intentSizes[base] ?? 100) * scale * (0.5 + random()) * (buy ? 1 : 0.6)
    const digits = base === 'BTC' || base === 'ETH' ? 4 : 0
    const amount = `${money(quantity, digits)} ${base}`
    const price = OTC_PRICE[pair] ?? 1
    // The detail page has to answer what is locked and for how long, so every intent carries a
    // validity window, a note and the amount still frozen against it.
    const live = status === '待匹配' || status === '已匹配'
    intentOrders.push({
      orderId: String(
        1209056642133905184n + BigInt(numericSeed(id)) * 4099n + BigInt(index) * 12345678n,
      ),
      pair,
      side: buy ? '买' : '卖',
      contact: contacts[index % contacts.length],
      getCoin: buy ? base : quote,
      payCoin: buy ? quote : base,
      amount,
      qty: Number(quantity.toFixed(digits)),
      priceValue: price,
      digits,
      matched: status === '已匹配' || status === '已完成' ? amount : `0 ${base}`,
      createTime: stamp(6 + index * 30),
      status,
      price: money(price),
      // The note a client leaves is free text, so the seeded ones name the message key and the
      // price they quote rather than carrying a sentence no other language can render.
      validityHours: [24, 72, 168][index % 3],
      remarkKey: buy ? 'otcRemarkBuy' : 'otcRemarkSell',
      remarkPrice: money(price),
      attachment: status === '待匹配' ? `trade-request-${index + 1}.pdf` : '—',
      // A buy locks the currency it pays with, a sell locks the currency it gives away.
      frozen: live
        ? buy
          ? `${money(price * quantity, 0)} ${quote}`
          : `${money(quantity, digits)} ${base}`
        : `0 ${buy ? quote : base}`,
    })
  }
  const matchStatuses = ['待审核', '待复核', '已完成', '已拒绝']
  const matchOrders = []
  for (let index = 0; index < 6; index++) {
    const pair = pairs[(index + 1) % pairs.length]
    const [base, quote] = pair.split('/')
    const quantity = (index % 2 === 0 ? 1.2 : 900) * scale * (0.5 + random())
    const price = OTC_PRICE[pair] ?? 1
    matchOrders.push({
      orderNo: String(
        1209057511240028160n + BigInt(numericSeed(id)) * 6151n + BigInt(index) * 98765432n,
      ),
      role: index % 2 === 0 ? '买方' : '卖方',
      pair,
      buyCoin: base,
      payCoin: quote,
      price: `${money(price)} ${quote}`,
      priceValue: price,
      qty: `${money(quantity, 4)} ${base}`,
      qtyValue: Number(quantity.toFixed(4)),
      createTime: stamp(10 + index * 34),
      status: matchStatuses[index % matchStatuses.length],
    })
  }
  return { intentOrders, matchOrders }
}

// The operator console shows a matched order as a two-sided ticket: who took each side, what each
// side pays and receives, and the trail of whoever touched it. None of that exists in the list
// data, so it is derived from the order number — the same order always produces the same ticket.
export function matchDetailOf(account, orderNo, uid) {
  const order = account.otc.matchOrders.find((item) => item.orderNo === orderNo)
  if (!order) return null
  return buildMatchTicket(order, uid)
}

export function buildMatchTicket(order, uid) {
  const random = makeRandom(numericSeed(order.orderNo))
  const counterpartUid = String(8395610000n + BigInt(Math.floor(random() * 8000)))
  const notional = Number((order.qtyValue * order.priceValue).toFixed(2))
  const makerFee = Number((notional * 0.001).toFixed(2))
  const takerFee = Number((notional * 0.0015).toFixed(2))
  const buyerFee = order.role === '买方' ? takerFee : makerFee
  const sellerFee = order.role === '买方' ? makerFee : takerFee
  const buyer = {
    uid: order.role === '买方' ? uid : counterpartUid,
    roleKey: 'otcBuyer',
    kind: '买方',
    getCoin: order.buyCoin,
    getAmount: order.qtyValue,
    payCoin: order.payCoin,
    payAmount: notional,
    fee: buyerFee,
    feeTypeKey: order.role === '买方' ? 'otcFeeTaker' : 'otcFeeMaker',
  }
  const seller = {
    uid: order.role === '卖方' ? uid : counterpartUid,
    roleKey: 'otcSeller',
    kind: '卖方',
    getCoin: order.payCoin,
    getAmount: notional,
    payCoin: order.buyCoin,
    payAmount: order.qtyValue,
    fee: sellerFee,
    feeTypeKey: order.role === '卖方' ? 'otcFeeTaker' : 'otcFeeMaker',
  }
  return {
    orderNo: order.orderNo,
    pair: order.pair,
    price: order.priceValue,
    qty: order.qtyValue,
    buyCoin: order.buyCoin,
    payCoin: order.payCoin,
    createTime: order.createTime,
    status: order.status,
    buyer,
    seller,
    buyerFee,
    sellerFee,
    feeCoin: order.payCoin,
    preview: [buyer, seller],
    // The trail names a message key per line, so the note reads in the visitor's language while
    // the operator ids stay as they are.
    log: [
      { action: '创建撮合单', operator: uid, time: order.createTime, remarkKey: 'otcLogCreated' },
      { action: '风控复核', operator: 'risk@bge-demo', time: stamp(9), remarkKey: 'otcLogRisk' },
      {
        action: '更新状态',
        operator: 'dealer@bge-demo',
        time: stamp(5),
        remarkKey: 'otcLogStatus',
        status: order.status,
      },
    ],
  }
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
  // Three keys, one per state, so 有效 / 已过期 / 已吊销 all stay demonstrable without the list
  // looking like a dumping ground.
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

// Total holdings in HKD. The account limit on the asset page is quoted in HKD, so it has to be
// compared against the same book the balance table shows.
function positionValue(balances) {
  const total = (book) =>
    Object.entries(book).reduce((sum, [coin, amount]) => sum + (demoPrices[coin] ?? 0) * amount, 0)
  return Number(((total(balances.fund) + total(balances.trade)) / demoPrices.HKD).toFixed(2))
}

// What each account has locked, and by which orders. A resting spot 买入 freezes the currency it
// pays with, a live OTC 卖 intent freezes the coin it gives away — so hovering a frozen cell can
// name the orders responsible.
function buildFrozen(balances, spot, otc) {
  const add = (book, coin, amount, orderId) => {
    if (!amount) return
    if (!book[coin]) book[coin] = { amount: 0, orders: [] }
    book[coin].amount += amount
    book[coin].orders.push(orderId)
  }
  const fund = {}
  const trade = {}
  otc.intentOrders
    .filter(
      (order) => order.side === '卖' && (order.status === '待匹配' || order.status === '已匹配'),
    )
    .forEach((order) => add(fund, order.payCoin, order.qty, order.orderId))
  spot.currentDetail.forEach((order) => {
    if (order.side === '买入') add(trade, order.quote, order.notional, order.orderId)
    else add(trade, order.coin, order.quantity, order.orderId)
  })
  // Never freeze more than the account actually holds.
  const clamp = (book, available) =>
    Object.fromEntries(
      Object.entries(book).map(([coin, entry]) => [
        coin,
        {
          amount: Number(Math.min(entry.amount, available[coin] ?? 0).toFixed(8)),
          orders: entry.orders,
        },
      ]),
    )
  return { fund: clamp(fund, balances.fund), trade: clamp(trade, balances.trade) }
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
  const plan = ACCOUNT_PLANS[profile.kind]
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
        spotOrders: { current: [], history: [], deals: [], currentDetail: [], historyDetail: [] },
        walletRecords: {
          digital: [],
          fiat: [],
          transfer: [],
          quick: [],
          digitalDetail: [],
          fiatDetail: [],
        },
        reports: { daily: [], monthly: [] },
        otc: { intentOrders: [], matchOrders: [] },
      }
    : null
  const balances = empty
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
      }
  const spotOrders = empty ? empty.spotOrders : buildSpot(random, profile, plan, balances.trade)
  const otc = empty ? empty.otc : buildOtc(random, Math.max(scale, 0.5), pairPool, profile.id)
  const holdUsed = positionValue(balances)
  // Today's orders, priced in HKD, are what the 交易剩余额度(今日) line is measured against.
  const today = new Date(DEMO_TODAY).toISOString().slice(0, 10)
  const dailyUsed = Number(
    (
      spotOrders.currentDetail
        .filter((order) => order.createTime.startsWith(today))
        .reduce((sum, order) => sum + (demoPrices[order.quote] ?? 0) * order.notional, 0) /
      demoPrices.HKD
    ).toFixed(2),
  )
  return {
    ...profile,
    balances,
    spotOrders,
    walletRecords: empty
      ? empty.walletRecords
      : buildWallet(random, profile, Math.max(scale, 0.4), bank),
    reports: empty ? empty.reports : buildSettle(),
    otc,
    security: buildSecurity(profile),
    payment: { bank, wallet },
    apiKeys: buildApiKeys(profile),
    verification: VERIFICATION[profile.kind],
    plan: {
      ...plan,
      maker: feeOf(plan, 'maker'),
      taker: feeOf(plan, 'taker'),
      holdUsed,
      // Rounded to the nearest 10,000 HKD so the panel reads like a policy figure rather than a
      // valuation.
      holdLimit: Math.round((holdUsed * plan.limitFactor) / 10000) * 10000,
      dailyLimit: Math.round((holdUsed * plan.limitFactor) / 20000) * 10000,
      dailyUsed,
    },
    frozen: buildFrozen(balances, spotOrders, otc),
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
