// 总览's two order panels read the 订单 module's data rather than keeping a copy of it: the rows are
// the very position arrays that module's tables render, and a field is found by the label its column
// carries, so reseeding an account or renaming a column cannot leave 总览 describing orders the
// reader cannot then find in 订单. The panels are narrower than the module on purpose — a summary,
// with the module one click away for the full field set — so which fields to keep is decided here,
// beside the labels they are read by.
import { columns, listHref, reportTabs } from './reportColumns'

// A spot row is a position array, so a field is found by the label of the column it sits under. The
// two tabs lay the same fields out differently (历史委托 widens 成交状态 out to the last column), so
// the index is asked for per tab instead of written down.
const spotIndex = (tab, label) => columns('spot', tab).indexOf(label)

// 当前委托: the module's own 当前委托 columns, less the two a summary has no use for. The width is
// what fits the panel, not what fits the module.
export const OPEN_ORDER_FIELDS = [
  ['交易对', 96],
  ['买卖方向', 92],
  ['委托价格', 104],
  ['委托数量', 104],
  ['成交状态', 92],
]

export function openOrderColumns() {
  return OPEN_ORDER_FIELDS.map(([label, width]) => ({
    prop: String(spotIndex('current', label)),
    label,
    width,
  }))
}

// Keyed by the column's index in the module's row, which is what the module's own table uses as its
// cell prop, so a cell is rendered by the same formatter from the same value.
export function openOrdersOf(account) {
  return account.spotOrders.current.map((row) =>
    Object.fromEntries(
      OPEN_ORDER_FIELDS.map(([label]) => {
        const index = spotIndex('current', label)
        return [String(index), row[index]]
      }),
    ),
  )
}

// 订单: the four kinds of order the module keeps in separate tabs, newest first — what this panel is
// for is showing what the reader has just done. 方向 is left out even though every kind has one: the
// three module tabs word it differently (买入/卖出, 买/卖, 买方/卖方), which reads as a mistake in a
// single column.
export const ORDER_FEED_FIELDS = [
  ['pair', '交易对', 92],
  ['quantity', '数量', 96],
  ['status', '状态', 88],
]
export const ORDER_FEED_ROWS = 6
// 类型 names the tab a row came from, so it uses that tab's own label.
export const ORDER_KIND_KEYS = { spot: 'text148', intent: 'text317', match: 'text318' }

export function orderFeedOf(account) {
  const spot = (tab) => (row) => ({
    kind: 'spot',
    pair: row[spotIndex(tab, '交易对')],
    quantity: row[spotIndex(tab, '委托数量')],
    status: row[spotIndex(tab, '成交状态')],
    createTime: row[spotIndex(tab, '委托时间')],
  })
  return [
    ...account.spotOrders.current.map(spot('current')),
    ...account.spotOrders.history.map(spot('history')),
    // 意向单 and 撮合单 are records rather than position arrays, so they name their own fields — and
    // the two quantities are already formatted the way the module's tables show them.
    ...account.otc.intentOrders.map((order) => ({
      kind: 'intent',
      pair: order.pair,
      quantity: order.amount,
      status: order.status,
      createTime: order.createTime,
    })),
    ...account.otc.matchOrders.map((order) => ({
      kind: 'match',
      pair: order.pair,
      quantity: order.qty,
      status: order.status,
      createTime: order.createTime,
    })),
  ]
    .sort((a, b) => b.createTime.localeCompare(a.createTime))
    .slice(0, ORDER_FEED_ROWS)
}

// 查看更多. 当前委托 goes to its own tab of the module. 订单 covers every kind and there is no list of
// everything, so it goes where the site's own 订单 entries go — the header menu, the footer and the
// marketing pages all open 现货交易记录.
export const openOrdersHref = listHref('spot-current')
export const ordersHref = reportTabs[0][2]
