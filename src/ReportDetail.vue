<script setup>
// One page for every record the 订单 module can open: a spot order, a wallet deposit or withdrawal,
// an OTC intent, an OTC match order. They differ in which fields they show, not in how they look,
// so the page renders a list of blocks and each entry point supplies its own field list.
import SiteHeader from './SiteHeader.vue'
import KycRequired from './KycRequired.vue'
import { formatCell, i18n, tr } from './i18n'
import { kycVerified } from './session'
import { currentAccount, matchDetailOf } from './demoAccounts'
import { listHref, reportTabs as tabs } from './reportColumns'
import { Tickets } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { routeSearch } from './route'

const params = new URLSearchParams(routeSearch())
const detailType = params.get('type') ?? ''
const detailId = params.get('id') ?? ''
const account = currentAccount
const fmt = (value, digits = 2) =>
  Number(value).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

// Which sidebar entry stays highlighted while a detail page is open.
const openTabs = {
  'spot-current': 'spot',
  'spot-history': 'spot',
  'wallet-digital': 'wallet',
  'wallet-fiat': 'wallet',
  'otc-intent': 'otc',
  'otc-match': 'otc',
}
const activeTab = computed(() => openTabs[detailType] ?? '')
// The list page reads the tab back out of this link, so the reader returns to the tab they left.
const backHref = listHref(detailType)

// Spot and wallet rows are position arrays, so the id is the index into the same list the table
// rendered — and the detail arrays are built alongside them, in the same order.
const spotRecord = computed(() => {
  const list =
    detailType === 'spot-history'
      ? account.value.spotOrders.historyDetail
      : account.value.spotOrders.currentDetail
  return list[Number(detailId)] ?? null
})
const walletRecord = computed(() => {
  const list =
    detailType === 'wallet-fiat'
      ? account.value.walletRecords.fiatDetail
      : account.value.walletRecords.digitalDetail
  return list[Number(detailId)] ?? null
})
const intentRecord = computed(
  () => account.value.otc.intentOrders.find((order) => order.orderId === detailId) ?? null,
)
const matchTicket = computed(() =>
  detailType === 'otc-match' ? matchDetailOf(account.value, detailId, account.value.uid) : null,
)

const spotItems = (order) => {
  const history = detailType === 'spot-history'
  return [
    ['委托ID', order.orderId],
    ['创建时间', order.createTime],
    ['交易对', order.pair],
    ['订单类型', order.type],
    ['买卖方向', order.side],
    ['委托价格', `${fmt(order.price)} ${order.quote}`],
    ['委托数量', `${fmt(order.quantity, 6)} ${order.coin}`],
    history ? ['成交均价', `${fmt(order.avgPrice)} ${order.quote}`] : null,
    ['成交数量', `${fmt(order.filled, 6)} ${order.coin}`],
    ['成交金额', `${fmt(order.amount ?? order.notional)} ${order.quote}`],
    ['撤单数量', `${fmt(order.cancelled, 6)} ${order.coin}`],
    ['STP', order.stp],
    ['下单来源', order.source],
    ['用户UID', order.uid],
    ['手续费', `${fmt(order.fee, 6)} ${order.feeCoin}`],
    ['状态', order.status],
  ].filter(Boolean)
}

// A deposit and a withdrawal are different documents, so the wallet detail forks on the direction
// the seeded row carries.
const walletItems = (record) => {
  const deposit = record.direction === '存款'
  const common = [
    ['用户UID', record.uid],
    ['币种', record.coin],
  ]
  if (detailType === 'wallet-fiat') {
    return [
      [deposit ? '存款单号' : '出金单号', record.no],
      ...common,
      [deposit ? '存款金额' : '出金金额', fmt(record.amount)],
      deposit ? null : ['手续费', fmt(record.fee)],
      deposit ? null : ['实付金额', fmt(record.received)],
      ['用户银行', record.bank],
      ['用户账号', record.bankAccount],
      ['公司银行', `${record.companyBank} ${record.companyAccount}`],
      deposit ? ['支付流水号', record.serial] : null,
      deposit ? ['风险标识', record.risk] : null,
      ['申请时间', record.createTime],
      ['状态', record.status],
    ].filter(Boolean)
  }
  return [
    [deposit ? '存款单号' : '取款单号', record.no],
    ...common,
    ['网络', record.network],
    [deposit ? '存款数量' : '取款数量', fmt(record.quantity, 8)],
    deposit ? null : ['手续费', fmt(record.fee, 8)],
    deposit ? null : ['汇出金额', fmt(record.received, 8)],
    deposit ? ['TXID', record.txid] : ['出款地址', record.address],
    deposit ? ['用户地址', record.address] : null,
    deposit ? ['地址认证', record.addressVerified] : null,
    ['确认数', record.confirmations],
    ['申请时间', record.createTime],
    [deposit ? '存款状态' : '状态', record.status],
  ].filter(Boolean)
}

const intentItems = (order) => [
  ['交易对', order.pair],
  ['方向', order.side],
  ['委托类型', order.contact],
  ['委托人UID', account.value.uid],
  ['购买币种', order.getCoin],
  ['购买/出售数量', order.amount],
  ['支付币种', order.payCoin],
  ['最高购买单价', `${order.price} ${order.payCoin}`],
  ['资产冻结数量', order.frozen],
  [
    '有效期（仅支持至小时）',
    order.validityHours ? `${order.validityHours} ${i18n.global.t('otcHourUnit')}` : '—',
  ],
  // A seeded note names its message key; one the client typed is shown as it was written.
  [
    '备注内容',
    order.remarkKey
      ? i18n.global.t(order.remarkKey, { price: order.remarkPrice })
      : (order.remark ?? '—'),
  ],
  ['附件', order.attachment ?? '—'],
  ['创建时间', order.createTime],
  ['状态', order.status],
]

const sideItems = (side) => [
  ['用户UID', side.uid],
  ['交易方', side.roleKey.startsWith('otcBuyer') ? '买方' : '卖方'],
  ['支付币种', side.payCoin],
  ['支付金额', fmt(side.payAmount)],
  ['获得币种', side.getCoin],
  ['获得金额', fmt(side.getAmount)],
  ['手续费类型', side.feeTypeKey.startsWith('otcFeeMaker') ? '挂单' : '吃单'],
  ['手续费金额', `${fmt(side.fee)} ${matchTicket.value.feeCoin}`],
]

// Everything the page renders, in order. An empty list means there is nothing to show for this id.
const blocks = computed(() => {
  if (detailType === 'spot-current' || detailType === 'spot-history') {
    return spotRecord.value
      ? [{ kind: 'descriptions', heading: '订单信息', items: spotItems(spotRecord.value) }]
      : []
  }
  if (detailType === 'wallet-digital' || detailType === 'wallet-fiat') {
    return walletRecord.value
      ? [{ kind: 'descriptions', heading: '订单信息', items: walletItems(walletRecord.value) }]
      : []
  }
  if (detailType === 'otc-intent') {
    // The console shows an intent as a plain label/value list rather than a table.
    return intentRecord.value ? [{ kind: 'list', items: intentItems(intentRecord.value) }] : []
  }
  if (detailType === 'otc-match') {
    const ticket = matchTicket.value
    if (!ticket) return []
    return [
      {
        kind: 'descriptions',
        heading: '订单信息',
        items: [
          ['订单号', ticket.orderNo],
          ['交易对', ticket.pair],
          ['撮合单价', `${fmt(ticket.price)} ${ticket.payCoin}`],
          ['撮合数量', `${fmt(ticket.qty, 4)} ${ticket.buyCoin}`],
          ['买方手续费', `${fmt(ticket.buyerFee)} ${ticket.feeCoin}`],
          ['卖方手续费', `${fmt(ticket.sellerFee)} ${ticket.feeCoin}`],
          ['创建时间', ticket.createTime],
          ['状态', ticket.status],
        ],
      },
      { kind: 'list', heading: '买方信息', items: sideItems(ticket.buyer) },
      { kind: 'list', heading: '卖方信息', items: sideItems(ticket.seller) },
      {
        kind: 'table',
        heading: '成交预览',
        head: [
          '交易方',
          '用户UID',
          '支付币种',
          '支付金额',
          '获得币种',
          '获得金额',
          '手续费类型',
          '手续费金额',
          '成交单价',
        ],
        rows: ticket.preview.map((side) => [
          side.roleKey.startsWith('otcBuyer') ? '买方' : '卖方',
          side.uid,
          side.payCoin,
          fmt(side.payAmount),
          side.getCoin,
          fmt(side.getAmount),
          side.feeTypeKey.startsWith('otcFeeMaker') ? '挂单' : '吃单',
          fmt(side.fee),
          fmt(ticket.price),
        ]),
      },
      {
        kind: 'descriptions',
        heading: '交换情况',
        items: [
          ['买方支付', `${fmt(ticket.buyer.payAmount)} ${ticket.buyer.payCoin}`],
          ['买方获得', `${fmt(ticket.buyer.getAmount, 4)} ${ticket.buyer.getCoin}`],
          ['卖方支付', `${fmt(ticket.seller.payAmount, 4)} ${ticket.seller.payCoin}`],
          ['卖方获得', `${fmt(ticket.seller.getAmount)} ${ticket.seller.getCoin}`],
        ],
      },
      {
        kind: 'table',
        heading: '操作记录',
        head: ['操作类型', '操作人', '操作时间', '备注'],
        rows: ticket.log.map((entry) => [
          entry.action,
          entry.operator,
          entry.time,
          entry.remarkKey
            ? i18n.global.t(entry.remarkKey, { status: tr(entry.status) })
            : entry.remark,
        ]),
      },
    ]
  }
  return []
})
// The empty state also covers an unknown type: the page is only reachable through a row's link, so
// there is nothing to fall back to.
const empty = computed(() => !blocks.value.length)
</script>

<style scoped>
.user-layout .order-sidebar {
  flex: 0 0 220px;
  width: 220px;
}
.user-layout .order-sidebar a {
  padding: 0 24px;
  white-space: nowrap;
}
.report-main {
  min-width: 0;
}
.order-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 0 22px;
  border-bottom: 1px solid #dce2eb;
}
.order-title {
  margin: 0;
  font-size: 22px;
  font-weight: 500;
}
.detail-back {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 28px;
  border: 1px solid #dce2eb;
  border-radius: 5px;
  background: #fff;
  color: #303744;
  font-size: 14px;
  text-decoration: none;
}
.detail-back:hover {
  border-color: #f0d000;
  color: #b98c00;
}
.detail-heading {
  margin: 34px 0 16px;
  padding-left: 10px;
  border-left: 4px solid #f0d000;
  color: #171d27;
  font-size: 16px;
  font-weight: 600;
}
.detail-block:first-child .detail-heading {
  margin-top: 26px;
}
.detail-list {
  border: 1px solid #e5e9f0;
  border-radius: 6px;
}
.detail-list > div {
  display: flex;
  gap: 24px;
  padding: 16px 22px;
  border-bottom: 1px solid #eef1f6;
  font-size: 14px;
}
.detail-list > div:last-child {
  border-bottom: 0;
}
.detail-list span {
  flex: 0 0 180px;
  color: #7d8695;
}
.detail-list b {
  color: #303744;
  font-weight: 500;
  overflow-wrap: anywhere;
}
.detail-desc :deep(.el-descriptions__label) {
  width: 180px;
  color: #7d8695;
  font-weight: 400;
}
.detail-desc :deep(.el-descriptions__content) {
  color: #303744;
}
.detail-empty {
  padding: 120px 0;
  color: #a4abb5;
  font-size: 14px;
  text-align: center;
}
</style>

<template>
  <div class="user-page report-page">
    <SiteHeader active="report" />
    <div class="user-layout">
      <aside
        class="order-sidebar"
        :aria-label="$t('text293')"
      >
        <a
          v-for="tab in tabs"
          :key="tab[0]"
          :href="tab[2]"
          :class="{ sel: activeTab === tab[0] }"
          :aria-current="activeTab === tab[0] ? 'page' : undefined"
          ><el-icon><Tickets /></el-icon>{{ tr(tab[1]) }}</a
        >
      </aside>
      <main class="report-main">
        <KycRequired v-if="!kycVerified" />
        <section
          v-else
          class="report-box"
        >
          <div class="order-head">
            <h1 class="order-title">{{ $t('detailTitle') }}</h1>
            <a
              class="detail-back"
              :href="backHref"
              >{{ $t('detailBack') }}</a
            >
          </div>
          <div
            v-for="(block, index) in blocks"
            :key="index"
            class="detail-block"
          >
            <h3
              v-if="block.heading"
              class="detail-heading"
            >
              {{ tr(block.heading) }}
            </h3>
            <el-descriptions
              v-if="block.kind === 'descriptions'"
              :column="2"
              border
              class="detail-desc"
            >
              <el-descriptions-item
                v-for="(item, itemIndex) in block.items"
                :key="itemIndex"
                :label="tr(item[0])"
                >{{ tr(item[1]) }}</el-descriptions-item
              >
            </el-descriptions>
            <div
              v-else-if="block.kind === 'list'"
              class="detail-list"
            >
              <div
                v-for="(item, itemIndex) in block.items"
                :key="itemIndex"
              >
                <span>{{ tr(item[0]) }}</span
                ><b>{{ tr(item[1]) }}</b>
              </div>
            </div>
            <el-table
              v-else
              :data="
                block.rows.map((row) =>
                  Object.fromEntries(row.map((cell, cellIndex) => [String(cellIndex), cell])),
                )
              "
              class="report-table"
              :header-cell-style="{ background: '#f4f6f9', color: '#697585', fontWeight: '400' }"
            >
              <el-table-column
                v-for="(column, columnIndex) in block.head"
                :key="column"
                :formatter="formatCell"
                :prop="String(columnIndex)"
                :label="tr(column)"
                min-width="120"
                align="center"
              />
            </el-table>
          </div>
          <p
            v-if="empty"
            class="detail-empty"
          >
            {{ $t('detailEmpty') }}
          </p>
        </section>
      </main>
    </div>
    <footer>
      <div class="footer-inner">
        <a
          class="brand footer-brand"
          href="/bge/hk/zh-CN/"
          ><img
            class="brand-logo brand-logo-full"
            src="/logo-bge.svg"
            alt="BGE"
            width="116"
            height="28"
        /></a>
        <div>
          <h4>{{ $t('text004') }}</h4>
          <a href="/bge/hk/zh-CN/about">{{ $t('text067') }}</a
          ><a href="/bge/hk/zh-CN/security">{{ $t('text068') }}</a>
        </div>
        <div>
          <h4>{{ $t('text069') }}</h4>
          <a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a>
        </div>
        <div>
          <h4>{{ $t('text070') }}</h4>
          <a>{{ $t('text071') }}</a
          ><a>{{ $t('text110') }}</a>
        </div>
        <div>
          <h4>{{ $t('text067') }}</h4>
          <a>{{ $t('text072') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
