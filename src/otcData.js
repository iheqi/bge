import { currentAccount, useAccountState } from './demoAccounts'

// OTC follows the operator console: a client raises a one-sided intent order, an operator
// matches a buy intent with a sell intent, and the resulting match order goes through
// maker-checker review before it settles.
export const pairOptions = ['ETH/USDC', 'BTC/USDC', 'ETH/HKD', 'BTC/HKD', 'USDT/HKD', 'USDC/USD']
export const intentStatuses = ['待匹配', '已匹配', '已完成', '已撤单']
// A match order cannot be withdrawn, so 已取消 is not one of its states.
export const matchStatuses = ['待审核', '待复核', '已完成', '已拒绝']

// Seeded from the signed-in demo account, then kept per account on top of that seed. Opening a
// detail page is a full page load, so an order created or withdrawn in the list has to outlive it.
export const intentOrders = useAccountState(
  'otc-intent-orders',
  currentAccount.value.otc.intentOrders,
)
export const matchOrders = useAccountState('otc-match-orders', currentAccount.value.otc.matchOrders)

const amountText = (value, digits) =>
  value.toLocaleString('en-US', { maximumFractionDigits: digits })

// A client-side order is placed by the client itself and waits for an operator to match it. It
// carries the same fields as the seeded ones, so its detail page is just as complete.
export function createIntentOrder({ pair, side, quantity, price, validity, remark }) {
  const [base, quote] = pair.split('/')
  const buy = side === 'buy'
  const qty = Number(quantity)
  const priceValue = Number(price)
  const digits = base === 'BTC' || base === 'ETH' ? 4 : 0
  const order = {
    orderId: String(Date.now()) + String(intentOrders.value.length + 1).padStart(2, '0'),
    pair,
    side: buy ? '买' : '卖',
    contact: '客户端下单',
    getCoin: buy ? base : quote,
    payCoin: buy ? quote : base,
    amount: `${amountText(qty, digits)} ${base}`,
    qty,
    priceValue,
    digits,
    matched: `0 ${base}`,
    createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
    status: '待匹配',
    price: amountText(priceValue, 2),
    validityHours: Number(validity),
    remarkKey: null,
    remark: remark || '—',
    attachment: '—',
    // A buy locks what it pays with, a sell locks what it gives away.
    frozen: buy
      ? `${amountText(priceValue * qty, 2)} ${quote}`
      : `${amountText(qty, digits)} ${base}`,
  }
  intentOrders.value.unshift(order)
  return order
}

// Cancelling removes the order outright; only unmatched intents may be withdrawn.
export function cancelIntentOrder(order) {
  intentOrders.value = intentOrders.value.filter((item) => item !== order)
}
