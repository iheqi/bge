// The record pages and their detail pages share one source of truth for the sidebar and for the
// column labels, so a field renamed here cannot drift out of sync with the detail page that labels
// itself after it.

// The four record modules, in the order the sidebar lists them.
export const reportTabs = [
  ['spot', '现货交易记录', '/bge/hk/zh-CN/user/report/spot'],
  ['wallet', '钱包操作记录', '/bge/hk/zh-CN/user/report/wallet'],
  ['otc', 'OTC 订单', '/bge/hk/zh-CN/user/report/otc-orders'],
  ['settle', '结单记录', '/bge/hk/zh-CN/user/report/settle'],
]

// A row's last cell is a link rather than a value, so the table has to render it as an action
// column instead of a formatted cell.
const ACTIONS = new Set(['详情', '查看', '操作'])

export const detailHref = (type, id) =>
  `/bge/hk/zh-CN/user/report/detail?type=${type}&id=${encodeURIComponent(id)}`

// The position arrays behind the spot, wallet and settle tables carry no field names, so the label
// list is also the field list: index N of a row is index N of this array.
export function columns(type, tab) {
  if (type === 'spot') {
    if (tab === 'deals')
      return [
        '成交时间',
        '交易对',
        '买卖方向',
        '成交价格',
        '成交数量',
        '成交金额',
        '手续费',
        '成交角色',
      ]
    if (tab === 'history')
      return [
        '委托时间',
        '交易对',
        '订单类型',
        '买卖方向',
        '委托价格',
        '委托数量',
        '成交均价',
        '成交数量',
        '成交金额',
        '成交状态',
        '详情',
      ]
    return [
      '委托时间',
      '交易对',
      '订单类型',
      '买卖方向',
      '委托价格',
      '委托数量',
      '成交状态',
      '详情',
    ]
  }
  if (type === 'wallet') {
    if (tab === 'fiat')
      return ['时间', '类型', '法币', '汇款金额', '汇款银行卡', '银行卡标签', '状态', '操作']
    if (tab === 'transfer') return ['时间', '币种', '数量', '从', '到', '状态']
    // 跨币种划转 carries the same six fields as 跨账户划转; it used to be rendered under the
    // five-column 数字资产 header, which hid its status.
    if (tab === 'quick') return ['时间', '币种', '数量', '从', '到', '状态']
    return ['时间', '类型', '数字货币', '数量', '发起方地址', '状态', '操作']
  }
  if (type === 'settle') return ['结单名称', '操作']
  return []
}

// The labels rendered through a formatter, plus the trailing action column when the list has one.
export function splitColumns(type, tab) {
  const all = columns(type, tab)
  const last = all[all.length - 1]
  return ACTIONS.has(last) ? { head: all.slice(0, -1), action: last } : { head: all, action: null }
}
