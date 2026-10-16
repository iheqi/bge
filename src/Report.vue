<script setup>
import SiteHeader from './SiteHeader.vue'
import KycNotice from './KycNotice.vue'
import KycRequired from './KycRequired.vue'
import { formatCell, tr, i18n } from './i18n'
import { kycVerified } from './session'
import { Tickets, Calendar, Close, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref, watch } from 'vue'
import {
  cancelIntentOrder,
  createIntentOrder,
  intentOrders,
  intentStatuses,
  matchOrders,
  matchStatuses,
  pairOptions,
} from './otcData'
import { currentAccount } from './demoAccounts'
const t = i18n.global.t
const showKycNotice = ref(!kycVerified.value)
const path = window.location.pathname
const type = path.includes('/wallet')
  ? 'wallet'
  : path.includes('/otc-orders')
    ? 'otc'
    : path.includes('/settle')
      ? 'settle'
      : 'spot'
const tabs = [
  ['spot', '现货交易记录', '/bge/hk/zh-CN/user/report/spot'],
  ['wallet', '钱包操作记录', '/bge/hk/zh-CN/user/report/wallet'],
  ['otc', 'OTC 订单', '/bge/hk/zh-CN/user/report/otc-orders'],
  ['settle', '结单记录', '/bge/hk/zh-CN/user/report/settle'],
]
// Every sub page opens on its first tab.
const walletTab = ref('digital')
const spotTab = ref('current')
const otcTab = ref('intent')
const otcPair = ref('all')
const otcDirection = ref('all')
const otcStatus = ref('all')
const settleTab = ref('all')
const walletDirection = ref('deposit')
const walletCoin = ref('all')
const walletStatus = ref('all')
const spotPair = ref('all')
const spotOrderType = ref('all')
const spotSide = ref('all')
const walletRange = ref([])
const otcRange = ref([])
const applied = ref({ spot: [], wallet: [], otc: { pair: 'all', direction: 'all', status: 'all', range: [] } })
function applyFilters() {
  applied.value = {
    ...applied.value,
    wallet: walletRange.value,
    otc: {
      pair: otcPair.value,
      direction: otcDirection.value,
      status: otcStatus.value,
      range: otcRange.value,
    },
  }
}
function inRange(time, range) {
  if (!range || range.length !== 2 || !range[0] || !range[1]) return true
  const day = String(time).slice(0, 10).replaceAll('/', '-')
  return day >= range[0] && day <= range[1]
}
const walletCoins = computed(() => walletTab.value === 'fiat'
  ? ['USD', 'HKD', 'CNY']
  : walletTab.value === 'digital'
    ? ['BTC', 'ETH', 'USDT', 'USDC']
    : ['USD', 'HKD', 'BTC', 'ETH', 'USDT', 'USDC'])
// Every order table is fed by the signed-in demo account, so switching accounts changes the rows.
const account = currentAccount
const rawRows = computed(() => {
  if (type === 'spot') {
    const orders = account.value.spotOrders
    return spotTab.value === 'deals' ? orders.deals : spotTab.value === 'history' ? orders.history : orders.current
  }
  if (type === 'wallet') {
    const records = account.value.walletRecords
    if (walletTab.value === 'fiat') return records.fiat
    if (walletTab.value === 'transfer') return records.transfer
    if (walletTab.value === 'quick') return records.quick
    return records.digital
  }
  const reports = account.value.reports
  return settleTab.value === 'monthly' ? reports.monthly : reports.daily
})
function rowTime(row) {
  const name = String(row[0])
  const day = name.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (day) return `${day[1]}-${day[2].padStart(2, '0')}-${day[3].padStart(2, '0')}`
  const month = name.match(/(\d{4})年(\d{1,2})月/)
  if (month) return `${month[1]}-${month[2].padStart(2, '0')}-01`
  return name.slice(0, 10).replaceAll('/', '-')
}
const mockRows = computed(() => {
  const range = applied.value[type]
  if (!range || range.length !== 2 || !range[0] || !range[1]) return rawRows.value
  return rawRows.value.filter((row) => inRange(rowTime(row), range))
})
function resetWalletFilters() {
  walletCoin.value = 'all'
  walletStatus.value = 'all'
  walletRange.value = []
  applied.value = { ...applied.value, wallet: [] }
}
// The two OTC tabs filter on different vocabularies, so switching one resets the row.
const otcDirections = computed(() => (otcTab.value === 'intent' ? ['买', '卖'] : ['买方', '卖方']))
const otcStatuses = computed(() => (otcTab.value === 'intent' ? intentStatuses : matchStatuses))
function resetOtcFilters() {
  otcPair.value = 'all'
  otcDirection.value = 'all'
  otcStatus.value = 'all'
  otcRange.value = []
  applyFilters()
}
const matchedFilter = () => (order) =>
  (applied.value.otc.pair === 'all' || order.pair === applied.value.otc.pair) &&
  (applied.value.otc.status === 'all' || order.status === applied.value.otc.status) &&
  inRange(order.createTime, applied.value.otc.range)
const visibleIntentOrders = computed(() =>
  intentOrders.value
    .filter(matchedFilter())
    .filter((order) => applied.value.otc.direction === 'all' || order.side === applied.value.otc.direction),
)
const visibleMatchOrders = computed(() =>
  matchOrders.value
    .filter(matchedFilter())
    .filter((order) => applied.value.otc.direction === 'all' || order.role === applied.value.otc.direction),
)
// Cancelling removes the row, so it is only offered while no operator has matched it yet.
// Match orders mirror the console, which offers no way to withdraw one.
const canCancelIntent = (order) => order.status === '待匹配'
async function confirmCancelIntent(order) {
  if (!canCancelIntent(order)) return
  try {
    await ElMessageBox.confirm(t('otcCancelConfirm'), t('otcCancelTitle'), {
      confirmButtonText: t('confirmAction'),
      cancelButtonText: tr('取消'),
      type: 'warning',
    })
  } catch {
    return
  }
  cancelIntentOrder(order)
  ElMessage.success(t('otcCancelDone'))
}
const showIntentForm = ref(false)
const intentPair = ref(pairOptions[0])
const intentSide = ref('buy')
const intentQuantity = ref('')
const intentPrice = ref('')
const intentValidity = ref('24')
const intentRemark = ref('')
const intentCoin = computed(() => intentPair.value.split('/')[0])
const intentPayCoin = computed(() => intentPair.value.split('/')[1])
const canSubmitIntent = computed(() => Boolean(intentQuantity.value && intentPrice.value && intentValidity.value))
function submitIntent() {
  if (!canSubmitIntent.value) return
  createIntentOrder({
    pair: intentPair.value,
    side: intentSide.value,
    quantity: intentQuantity.value,
    price: intentPrice.value,
    validity: intentValidity.value,
    remark: intentRemark.value,
  })
  showIntentForm.value = false
  intentQuantity.value = ''
  intentPrice.value = ''
  intentRemark.value = ''
  otcTab.value = 'intent'
  ElMessage.success(t('otcIntentCreated'))
}
watch(walletTab, resetWalletFilters)
watch(otcTab, resetOtcFilters)
watch(walletDirection, () => { walletStatus.value = 'all' })
const columns = () => {
  if (type === 'spot') {
    if (spotTab.value === 'deals') return ['成交时间', '交易对', '买卖方向', '成交价格', '成交数量', '成交金额', '手续费', '成交角色']
    if (spotTab.value === 'history') return ['委托时间', '交易对', '订单类型', '买卖方向', '委托价格', '委托数量', '成交均价', '成交数量', '成交金额', '成交状态', '详情']
  }
  if (type === 'wallet') {
    if (walletTab.value === 'fiat') return ['时间', '法币', '汇款金额', '汇款银行卡', '银行卡标签', '状态', '操作']
    if (walletTab.value === 'transfer') return ['时间', '币种', '数量', '从', '到', '状态']
    return ['时间', '数字货币', '数量', '发起方地址', '状态']
  }
  if (type === 'settle') return ['结单名称', '操作']
  return ['委托时间', '交易对', '订单类型', '买卖方向', '委托价格', '委托数量', '成交状态', '详情']
}
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
.otc-primary{flex:0 0 auto;height:40px;padding:0 28px;border:0;border-radius:5px;background:#f5ff18;color:#111;font-size:14px;font-weight:600;cursor:pointer}
.otc-primary:hover{background:#e8f000}
.otc-primary:disabled{background:#eef1f5;color:#a6adb8;cursor:not-allowed}
.otc-cancel{border:0;background:none;color:#d6a500;font-size:13px;cursor:pointer}
.otc-cancel:hover{color:#b98e00}
.otc-form-mask{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:24px;background:rgb(0 0 0 / 50%)}
.otc-form-dialog{position:relative;display:flex;flex-direction:column;width:min(720px,calc(100vw - 48px));max-height:calc(100vh - 48px);border-radius:16px;background:#fff;box-shadow:0 12px 32px rgb(0 0 0 / 28%);overflow:hidden}
/* The dark title bar mirrors the header dropdown panels. */
.otc-form-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:#272c37;color:#fff}
.otc-form-head h2{margin:0;font-size:18px;font-weight:600}
.otc-close{display:flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:transparent;color:#c0c4cc;font-size:18px;cursor:pointer}
.otc-close:hover{background:#343b49;color:#fff}
.otc-form{padding:26px 24px 4px;overflow:auto}
.otc-form :deep(.el-form-item){margin-bottom:18px}
.otc-form :deep(.el-form-item__label){padding-right:18px;color:#69717e;font-size:14px;line-height:44px}
.otc-form :deep(.el-input__wrapper),.otc-form :deep(.el-select__wrapper){min-height:44px;border-radius:8px;box-shadow:0 0 0 1px #d8dee8 inset}
.otc-form :deep(.el-input__wrapper.is-focus),.otc-form :deep(.el-select__wrapper.is-focused){box-shadow:0 0 0 1px #f0d000 inset}
.otc-form :deep(.el-textarea__inner){padding:12px;border-radius:8px;box-shadow:0 0 0 1px #d8dee8 inset}
.otc-form :deep(.el-radio){margin-right:28px;color:#505967;font-size:14px}
.otc-form :deep(.el-radio__label){padding-left:8px}
.otc-form :deep(.el-radio__input.is-checked .el-radio__inner){border-color:#f0d000;background:#f0d000}
.otc-form :deep(.el-radio__input.is-checked + .el-radio__label){color:#303744}
.otc-form :deep(.el-input-group__append){padding:0 20px;color:#7a8391;background:#f5f6f8;border-color:#d8dee8}
.otc-upload{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 22px;border:1px dashed #d8dee8;border-radius:8px;background:#fff;color:#d9a600;font-size:14px;cursor:pointer}
.otc-upload:hover{border-color:#f0d000;background:#fffdf0}
.otc-form-actions{display:flex;gap:11px;justify-content:flex-end;margin:8px 0 0;padding:18px 0 22px;border-top:1px solid #edf0f4}
.otc-secondary{min-width:118px;height:40px;border:0;border-radius:6px;background:#eaedf3;color:#303744;font-size:14px;cursor:pointer}
.otc-secondary:hover{background:#e2e6ee}
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
          :class="{ sel: type === tab[0] }"
          :aria-current="type === tab[0] ? 'page' : undefined"
          ><el-icon><Tickets /></el-icon>{{ tr(tab[1]) }}</a
        >
      </aside>
      <main class="report-main">
        <!-- An unverified client has no orders of any kind, so the four record pages are all the
             same 去认证 prompt instead of empty tables. -->
        <KycRequired v-if="!kycVerified" />
        <section
          v-else
          class="report-box"
        >
          <div class="order-head">
            <h1 class="order-title">{{ tr(tabs.find((tab) => tab[0] === type)[1]) }}</h1>
            <button v-if="type === 'otc'" class="otc-primary" @click="showIntentForm = true">{{ $t('otcCreateIntent') }}</button>
          </div>
          <template v-if="type === 'spot'"
            ><div class="sub-tabs">
              <span :class="{ active: spotTab === 'current' }" @click="spotTab = 'current'">{{ $t('text294') }}</span
              ><span :class="{ active: spotTab === 'history' }" @click="spotTab = 'history'">{{ $t('text295') }}</span
              ><span :class="{ active: spotTab === 'deals' }" @click="spotTab = 'deals'">{{ $t('text296') }}</span>
            </div>
            <div v-if="spotTab !== 'deals'" class="filters">
              <el-select v-model="spotPair" class="filter-select" :aria-label="$t('text247')"><el-option :label="$t('otcAllPairs')" value="all" /><el-option label="BTC/USDT" value="BTC/USDT" /><el-option label="ETH/USDT" value="ETH/USDT" /><el-option label="BTC/USD" value="BTC/USD" /></el-select><el-select v-model="spotOrderType" class="filter-select" :aria-label="$t('otcOrderType')"><el-option :label="$t('allOrderTypes')" value="all" /><el-option label="限价单" value="limit" /><el-option label="市价单" value="market" /></el-select
              ><button class="yellow">{{ $t('text283') }}</button
              ><button>{{ $t('text299') }}</button>
            </div>
            <div v-else class="filters">
              <el-select v-model="spotPair" class="filter-select" :aria-label="$t('text247')"><el-option :label="$t('otcAllPairs')" value="all" /><el-option label="BTC/USDT" value="BTC/USDT" /><el-option label="ETH/USDT" value="ETH/USDT" /><el-option label="BTC/USD" value="BTC/USD" /></el-select><el-select v-model="spotSide" class="filter-select" :aria-label="$t('text302')"><el-option :label="$t('allSides')" value="all" /><el-option label="买入" value="buy" /><el-option label="卖出" value="sell" /></el-select><button class="yellow">{{ $t('text283') }}</button><button>{{ $t('text299') }}</button>
            </div>
            <div v-if="spotTab === 'current'" class="table-head spot-head">
              <span>{{ $t('text300') }}</span
              ><span>{{ $t('text247') }}</span
              ><span>{{ $t('text301') }}</span
              ><span>{{ $t('text302') }}</span
              ><span>{{ $t('text303') }}</span
              ><span>{{ $t('text304') }}</span
              ><span>{{ $t('text305') }}</span
              ><span>{{ $t('text306') }}</span
              ><span>{{ $t('text065') }}</span>
            </div>
            <div v-else-if="spotTab === 'history'" class="table-head spot-head">
              <span>{{ tr('委托时间') }}</span><span>{{ tr('交易对') }}</span><span>{{ tr('订单类型') }}</span><span>{{ tr('买卖方向') }}</span><span>{{ tr('委托价格') }}</span><span>{{ tr('委托数量') }}</span><span>{{ tr('成交均价') }}</span><span>{{ tr('成交数量') }}</span><span>{{ tr('成交金额') }}</span><span>{{ tr('成交状态') }}</span><span>{{ tr('详情') }}</span>
            </div>
            <div v-else class="table-head spot-head">
              <span>{{ tr('成交时间') }}</span><span>{{ tr('交易对') }}</span><span>{{ tr('买卖方向') }}</span><span>{{ tr('成交价格') }}</span><span>{{ tr('成交数量') }}</span><span>{{ tr('成交金额') }}</span><span>{{ tr('手续费') }}</span><span>{{ tr('成交角色') }}</span>
            </div></template
          ><template v-else-if="type === 'wallet'"
            ><div class="sub-tabs">
              <span :class="{ active: walletTab === 'digital' }" @click="walletTab = 'digital'">{{ $t('text307') }}</span
              ><span :class="{ active: walletTab === 'fiat' }" @click="walletTab = 'fiat'">{{ $t('text308') }}</span
              ><span :class="{ active: walletTab === 'transfer' }" @click="walletTab = 'transfer'">{{ $t('text309') }}</span
              ><span :class="{ active: walletTab === 'quick' }" @click="walletTab = 'quick'">{{ $t('text310') }}</span>
            </div>
            <div class="filters">
              <el-select v-if="['fiat', 'digital'].includes(walletTab)" v-model="walletDirection" :aria-label="$t('walletDirection')" class="filter-select">
                <el-option :label="tr('存款')" value="deposit" />
                <el-option :label="tr('取款')" value="withdraw" />
              </el-select>
              <el-select v-model="walletCoin" :aria-label="$t('text345')" class="filter-select">
                <el-option :label="tr('全部币种')" value="all" />
                <el-option v-for="coin in walletCoins" :key="coin" :label="coin" :value="coin" />
              </el-select>
              <el-select v-if="['fiat', 'digital'].includes(walletTab)" v-model="walletStatus" :aria-label="$t('text063')" class="filter-select">
                <el-option :label="tr('全部状态')" value="all" />
                <el-option :label="tr('处理中')" value="pending" />
                <el-option :label="tr('已完成')" value="completed" />
                <el-option v-if="walletDirection === 'withdraw'" :label="tr('已取消')" value="cancelled" />
              </el-select>
              <el-date-picker
                v-model="walletRange"
                class="date-picker"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="-"
                :start-placeholder="tr('开始日期')"
                :end-placeholder="tr('结束日期')"
                aria-label="日期范围"
              /><button class="yellow" @click="applyFilters">{{ $t('text283') }}</button
              ><button @click="resetWalletFilters">{{ $t('text299') }}</button>
            </div>
            <div v-if="walletTab === 'fiat'" class="table-head wallet-head">
              <span>{{ $t('text313') }}</span
              ><span>{{ $t('text314') }}</span
              ><span>{{ $t('text285') }}</span
              ><span>{{ $t('text315') }}</span
              ><span>{{ $t('text063') }}</span
              ><span>{{ $t('text316') }}</span
              ><span>{{ $t('text286') }}</span>
            </div>
            <div v-else class="table-head wallet-head transfer-head">
              <span>{{ $t('text313') }}</span><span>{{ $t('text314') }}</span><span>{{ $t('text285') }}</span><span>{{ $t('text315') }}</span><span>{{ $t('text316') }}</span>
            </div></template
          ><template v-else-if="type === 'otc'"
            ><div class="sub-tabs">
              <span :class="{ active: otcTab === 'intent' }" @click="otcTab = 'intent'">{{ $t('text317') }}</span
              ><span :class="{ active: otcTab === 'match' }" @click="otcTab = 'match'">{{ $t('text318') }}</span>
            </div>
            <div class="filters">
              <el-select v-model="otcPair" class="filter-select" :aria-label="$t('text247')"><el-option :label="$t('otcAllPairs')" value="all" /><el-option v-for="item in pairOptions" :key="item" :label="item" :value="item" /></el-select><el-select v-model="otcDirection" class="filter-select" :aria-label="$t('otcDirection')"><el-option :label="$t('allSides')" value="all" /><el-option v-for="item in otcDirections" :key="item" :label="tr(item)" :value="item" /></el-select><el-select v-model="otcStatus" class="filter-select" :aria-label="$t('text063')"><el-option :label="$t('otcAllStatus')" value="all" /><el-option v-for="item in otcStatuses" :key="item" :label="tr(item)" :value="item" /></el-select
              ><el-date-picker
                v-model="otcRange"
                class="date-picker"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="-"
                :start-placeholder="$t('otcStartDate')"
                :end-placeholder="$t('otcEndDate')"
                :aria-label="$t('otcStartDate') + ' - ' + $t('otcEndDate')"
              /><button class="yellow" @click="applyFilters">{{ $t('text283') }}</button
              ><button @click="resetOtcFilters">{{ $t('text299') }}</button>
            </div>
            <el-table
              v-if="otcTab === 'intent'"
              :data="visibleIntentOrders"
              class="report-table"
              :header-cell-style="{ background: '#f4f6f9', color: '#697585', fontWeight: '400' }"
              :empty-text="$t('text066')"
            >
              <el-table-column prop="orderId" :label="$t('otcOrderId')" min-width="190" align="center" />
              <el-table-column :formatter="formatCell" prop="side" :label="$t('otcDirection')" min-width="90" align="center" />
              <el-table-column :formatter="formatCell" prop="contact" :label="$t('otcOrderType')" min-width="120" align="center" />
              <el-table-column prop="getCoin" :label="$t('text322')" min-width="100" align="center" />
              <el-table-column prop="payCoin" :label="$t('text321')" min-width="100" align="center" />
              <el-table-column prop="amount" :label="$t('text323')" min-width="140" align="center" />
              <el-table-column prop="matched" :label="$t('otcMatchedQty')" min-width="140" align="center" />
              <el-table-column prop="createTime" :label="$t('otcCreateTime')" min-width="170" align="center" />
              <el-table-column :formatter="formatCell" prop="status" :label="$t('text063')" min-width="100" align="center" />
              <el-table-column :label="$t('text065')" width="100" align="center">
                <template #default="{ row }"><button v-if="canCancelIntent(row)" class="otc-cancel" @click="confirmCancelIntent(row)">{{ $t('otcCancelOrder') }}</button><span v-else>--</span></template>
              </el-table-column>
            </el-table>
            <el-table
              v-else
              :data="visibleMatchOrders"
              class="report-table"
              :header-cell-style="{ background: '#f4f6f9', color: '#697585', fontWeight: '400' }"
              :empty-text="$t('text066')"
            >
              <el-table-column prop="orderNo" :label="$t('otcOrderNo')" min-width="190" align="center" />
              <el-table-column :formatter="formatCell" prop="role" :label="$t('otcDirection')" min-width="90" align="center" />
              <el-table-column prop="buyCoin" :label="$t('otcBuyCoin')" min-width="110" align="center" />
              <el-table-column prop="payCoin" :label="$t('text321')" min-width="110" align="center" />
              <el-table-column prop="price" :label="$t('otcMatchPrice')" min-width="130" align="center" />
              <el-table-column prop="qty" :label="$t('otcMatchQty')" min-width="120" align="center" />
              <el-table-column prop="createTime" :label="$t('otcCreateTime')" min-width="170" align="center" />
              <el-table-column :formatter="formatCell" prop="status" :label="$t('text063')" min-width="100" align="center" />
            </el-table>
            <div class="pager">‹　›</div></template
          ><template v-else
            ><div class="sub-tabs">
              <span :class="{ active: settleTab === 'all' }" @click="settleTab = 'all'">{{ $t('text165') }}</span
              ><span :class="{ active: settleTab === 'daily' }" @click="settleTab = 'daily'">{{ $t('text324') }}</span
              ><span :class="{ active: settleTab === 'monthly' }" @click="settleTab = 'monthly'">{{ $t('text325') }}</span
              ><em>{{ $t('text326') }}</em
              ><button>{{ $t('text020') }}</button>
            </div>
            <div class="table-head settle-head">
              <span>{{ $t('text327') }}</span
              ><span>{{ $t('text065') }}</span>
            </div></template
          >
          <el-table v-if="type !== 'otc'" :data="mockRows.map(row => Object.fromEntries(row.map((cell, index) => [String(index), cell])))" class="report-table" :header-cell-style="{ background: '#f4f6f9', color: '#697585', fontWeight: '400' }" :empty-text="$t('text066')">
            <el-table-column v-for="(column, index) in columns()" :key="column" :formatter="formatCell" :prop="String(index)" :label="tr(column)" min-width="130" align="center" />
          </el-table>
          <div v-if="type !== 'otc'" class="pager">‹　›</div>
        </section>
      </main>
    </div>
    <KycNotice v-model="showKycNotice" />
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
    <!-- 创建意向单 follows the console form: the same one-sided order the operators enter. -->
    <div v-if="showIntentForm" class="otc-form-mask" @click.self="showIntentForm = false">
      <section class="otc-form-dialog">
        <header class="otc-form-head">
          <h2>{{ $t('text398') }}</h2>
          <button class="otc-close" :aria-label="$t('text412')" @click="showIntentForm = false"><el-icon><Close /></el-icon></button>
        </header>
        <el-form class="otc-form" label-width="180px" @submit.prevent="submitIntent">
          <el-form-item :label="$t('text247')" required><el-select v-model="intentPair"><el-option v-for="item in pairOptions" :key="item" :label="item" :value="item" /></el-select></el-form-item>
          <el-form-item :label="$t('text399')" required><el-radio-group v-model="intentSide"><el-radio value="buy">{{ $t('text400') }}</el-radio><el-radio value="sell">{{ $t('text401') }}</el-radio></el-radio-group></el-form-item>
          <el-form-item :label="$t('text405')"><el-input :model-value="intentCoin" disabled /></el-form-item>
          <el-form-item :label="$t('text406')" required><el-input v-model="intentQuantity" :placeholder="$t('text414')" /></el-form-item>
          <el-form-item :label="$t('text321')"><el-input :model-value="intentPayCoin" disabled /></el-form-item>
          <el-form-item :label="$t('text407')" required><el-input v-model="intentPrice" :placeholder="$t('text415')"><template #append>{{ intentPayCoin }}</template></el-input></el-form-item>
          <el-form-item :label="$t('text408')"><el-input model-value="0" disabled><template #append>{{ intentPayCoin }}</template></el-input></el-form-item>
          <el-form-item :label="$t('text409')" required><el-input v-model="intentValidity" :placeholder="$t('text416')"><template #prefix><el-icon><Calendar /></el-icon></template></el-input></el-form-item>
          <el-form-item :label="$t('text410')"><el-input v-model="intentRemark" type="textarea" :rows="3" /></el-form-item>
          <el-form-item :label="$t('text411')"><button type="button" class="otc-upload"><el-icon><UploadFilled /></el-icon>{{ $t('text382') }}</button></el-form-item>
          <div class="otc-form-actions"><button type="button" class="otc-secondary" @click="showIntentForm = false">{{ $t('text412') }}</button><button type="button" class="otc-primary" :disabled="!canSubmitIntent" @click="submitIntent">{{ $t('text413') }}</button></div>
        </el-form>
      </section>
    </div>
  </div>
</template>
