import { ref } from 'vue'
import { currentAccount } from './demoAccounts'

// OTC follows the operator console: a client raises a one-sided intent order, an operator
// matches a buy intent with a sell intent, and the resulting match order goes through
// maker-checker review before it settles.
export const pairOptions = ['ETH/USDC', 'BTC/USDC', 'ETH/HKD', 'BTC/HKD', 'USDT/HKD', 'USDC/USD']
export const intentStatuses = ['待匹配', '已匹配', '已完成', '已撤单']
// A match order cannot be withdrawn, so 已取消 is not one of its states.
export const matchStatuses = ['待审核', '待复核', '已完成', '已拒绝']

// Seeded from the signed-in demo account. Switching accounts reloads the page, so these refs
// are rebuilt with the new account's orders.
export const intentOrders = ref([...currentAccount.value.otc.intentOrders])
export const matchOrders = ref([...currentAccount.value.otc.matchOrders])

// A client-side order is placed by the client itself and waits for an operator to match it.
export function createIntentOrder({ pair, side, quantity, price, validity, remark }) {
  const [base, quote] = pair.split('/')
  const buy = side === 'buy'
  const order = {
    orderId: String(Date.now()) + String(intentOrders.value.length + 1).padStart(2, '0'),
    pair,
    side: buy ? '买' : '卖',
    contact: '客户端下单',
    getCoin: buy ? base : quote,
    payCoin: buy ? quote : base,
    amount: `${quantity} ${base}`,
    matched: `0 ${base}`,
    createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
    status: '待匹配',
    price,
    validity,
    remark,
  }
  intentOrders.value.unshift(order)
  return order
}

// Cancelling removes the order outright; only unmatched intents may be withdrawn.
export function cancelIntentOrder(order) {
  intentOrders.value = intentOrders.value.filter((item) => item !== order)
}
